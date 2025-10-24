import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema: Schema<IOrder> = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ['credit', 'paypal', 'crypto'],
    required: true,
  },
  cardNumber: { type: String, required: true },
  expiry: { type: String, required: true },
  cvc: { type: String, required: true },
  price: { type: Number, required: true },
  courseId: { type: String },
  orderBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

export const Order = model<IOrder>('Order', orderSchema);
