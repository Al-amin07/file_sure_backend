import mongoose from 'mongoose';
import ApppError from '../../error/Apperror';
import { generateAccessToken } from '../../utils/generateAccessToken';
import generateReferralCode from '../../utils/generateReferralCode';
import { hashPassword, verifyPassword } from '../../utils/hasedPassword';
// import hashPassword from '../../utils/hasedPassword';
import { IUser } from './user.interface';
import { User } from './user.model';
import { StatusCodes } from 'http-status-codes';
import { Referral } from '../referal/referral.model';
// const register = async (payload: IUser, query: Record<string, unknown>) => {
//   const referradBy = query?.r;
//   if (payload?.password.length < 6) {
//     throw new ApppError(
//       StatusCodes.NOT_ACCEPTABLE,
//       'Password must be at least 6 char',
//     );
//   }

//   const isUserExist = await User.findOne({ email: payload?.email });
//   if (isUserExist) {
//     throw new ApppError(StatusCodes.NOT_ACCEPTABLE, 'User already exist');
//   }
//   const referralCode = generateReferralCode(payload?.name);
//   payload.referralCode = referralCode;
//   payload.password = await hashPassword(payload?.password);
//   if (referradBy) {
//     const isReferradByExist = await User.findOne({ referralCode: referradBy });
//     if (!isReferradByExist) {
//       throw new ApppError(StatusCodes.NOT_FOUND, 'Referral user not found');
//     }
//     payload.referredBy = isReferradByExist?.id;
//   }
//   const result = await User.create(payload);
//   return result;
// };

const register = async (payload: IUser, query: Record<string, unknown>) => {
  const referredBy = query?.r;

  if (payload?.password.length < 6) {
    throw new ApppError(
      StatusCodes.NOT_ACCEPTABLE,
      'Password must be at least 6 char',
    );
  }

  const isUserExist = await User.findOne({ email: payload?.email });
  if (isUserExist) {
    throw new ApppError(StatusCodes.NOT_ACCEPTABLE, 'User already exist');
  }

  const referralCode = generateReferralCode(payload?.name);
  payload.referralCode = referralCode;
  payload.password = await hashPassword(payload?.password);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await User.create([payload], { session });
    console.log({ result });
    if (referredBy) {
      const isReferredByExist = await User.findOne({
        referralCode: referredBy,
      });
      if (!isReferredByExist) {
        throw new ApppError(StatusCodes.NOT_FOUND, 'Referral user not found');
      }
      // await User.findByIdAndUpdate(
      //   result[0]?.id,
      //   {
      //     referredBy: isReferredByExist?.id,
      //   },
      //   { new: true, session },
      // );
      await Referral.create(
        [
          {
            referralBy: isReferredByExist?.id,
            referralTo: result[0]?.id,
          },
        ],
        { session },
      );
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    // Rollback transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const login = async (payload: { email: string; password: string }) => {
  const isuserExist = await User.findOne({ email: payload?.email });
  if (!isuserExist) {
    throw new ApppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const isPasswordMached = await verifyPassword(
    isuserExist?.password,
    payload?.password,
  );
  if (!isPasswordMached) {
    throw new ApppError(StatusCodes.NOT_ACCEPTABLE, 'Incorrect password');
  }
  const tokenData = {
    id: isuserExist?.id,
    name: isuserExist?.name,
    email: isuserExist?.email,
    referalCode: isuserExist?.referralCode,
  };
  const accessToken = await generateAccessToken(tokenData);
  return { accessToken };
};

export const userService = {
  register,
  login,
};
