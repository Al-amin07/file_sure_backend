import mongoose from 'mongoose';
import { Referral } from '../referal/referral.model';
import { User } from '../user/user.model';

const createOrder = async (payload: { id: string }) => {
  const isUserExist = await User.findOne({ id: payload?.id });
  const isReferralExist = await Referral.findOne({
    referralTo: payload?.id,
  });
  console.log({ isUserExist, isReferralExist });
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (isReferralExist && isReferralExist?.status === 'PENDING') {
      const updatedUser = await User.findByIdAndUpdate(
        isUserExist?.id,
        {
          balance: (isUserExist?.balance as number) + 2,
        },
        { new: true, session },
      );
      const updateReferral = await Referral.findByIdAndUpdate(
        isReferralExist?.id,
        { status: 'CONVERTED', convertedAt: Date() },
      );
    }
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    // Rollback transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const orderService = {
  createOrder,
};
