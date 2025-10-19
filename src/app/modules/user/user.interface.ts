import { Types } from 'mongoose';

export interface IUser {
  name: string;
  password: string;
  email: string;
  referralCode: string;
  // referredBy: Types.ObjectId;
  // referralConverted: boolean;
  balance: number;
}
