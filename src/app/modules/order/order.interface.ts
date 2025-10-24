import { Types } from 'mongoose';

export interface IOrder {
  fullName: string;
  email: string;
  paymentMethod: 'credit' | 'paypal' | 'crypto';
  cardNumber: string;
  expiry: string;
  cvc: string;
  courseId: string;
  price: number;
  orderBy: Types.ObjectId;
}
