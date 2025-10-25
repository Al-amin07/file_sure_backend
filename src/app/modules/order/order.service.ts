import mongoose from 'mongoose';
import { Referral } from '../referal/referral.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { verifyToken } from '../../utils/verifyToken';
import ApppError from '../../error/Apperror';
import { StatusCodes } from 'http-status-codes';

const createOrder = async (payload: IOrder) => {
  const isUserExist = await User.findOne({ id: payload?.orderBy });
  const isReferralExist = await Referral.findOne({
    referralTo: payload?.orderBy,
  });

  console.log({ isUserExist, isReferralExist });
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (isReferralExist && isReferralExist?.status === 'PENDING') {
      await User.findByIdAndUpdate(
        isReferralExist?.referralTo,
        {
          $inc: { balance: 2 },
        },
        { new: true, session },
      );
      await User.findByIdAndUpdate(
        isReferralExist?.referralBy,
        {
          $inc: { balance: 2 },
        },
        { new: true, session },
      );
      const updateReferral = await Referral.findByIdAndUpdate(
        isReferralExist?.id,
        { status: 'CONVERTED', convertedAt: Date() },
      );
    }

    const result = await Order.create(payload);
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

const orderHistory = async (token: string) => {
  if (!token) {
    throw new ApppError(StatusCodes.UNAUTHORIZED, 'No token found');
  }
  const decoded = await verifyToken(token);
  console.log({ decoded });
  const result = await Order.find({ orderBy: (decoded as any).id });

  const referral = await Referral.find({
    referralBy: (decoded as any).id,
  }).populate({ path: 'referralTo' });
  const user = await User.findById((decoded as any).id);
  console.log({ user });
  return {
    order: result,
    referral,
    user,
  };
  // return result;
};

export const orderService = {
  createOrder,
  orderHistory,
};
