import { model, Schema } from 'mongoose';
import { IReferral } from './referral.interface';

const referralSchema = new Schema<IReferral>({
  referralBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  referralTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: { type: String, enum: ['PENDING', 'CONVERTED'], default: 'PENDING' },
});

referralSchema.index({ referralBy: 1 }, { unique: true });

export const Referral = model('Referral', referralSchema);
