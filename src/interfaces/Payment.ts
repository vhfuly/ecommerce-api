import { Types } from 'mongoose';

export interface PaymentInterface {
  status: string;
  trackingCode: string;
  type: string;
  cost: number;
  deadline: number;
  purchase: Types.ObjectId;
  store: Types.ObjectId;
  payload: object;
}