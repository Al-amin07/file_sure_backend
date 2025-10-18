import { Types } from 'mongoose';

export interface IReferral {
  referralBy: Types.ObjectId;
  referralTo: Types.ObjectId;
  status: 'PENDING' | 'CONVERTED';
  convertedAt: Date;
}
