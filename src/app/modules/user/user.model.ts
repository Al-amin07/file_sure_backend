import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    referralCode: { type: String, required: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    referralConverted: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', userSchema);
