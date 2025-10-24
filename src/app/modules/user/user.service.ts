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
import { verifyToken } from '../../utils/verifyToken';
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

    const tokenData = {
      id: result[0]?.id,
      name: result[0]?.name,
      email: result[0]?.email,
      referalCode: result[0]?.referralCode,
    };
    const accessToken = await generateAccessToken(tokenData);
    await session.commitTransaction();
    session.endSession();
    return { accessToken };
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

const state = async (token: string) => {
  if (!token) {
    throw new ApppError(StatusCodes.UNAUTHORIZED, 'No token found');
  }
  const decoded = await verifyToken(token);
  const referral = await Referral.find({
    referralBy: (decoded as any).id,
  }).populate({ path: 'referralTo' });
  return referral;
};

export const userService = {
  register,
  login,
};
