import { Types } from 'mongoose';

export interface PaymentInterface {
  value: number;
  type: string;
  parceled: object;
  purchase: Types.ObjectId;
  store: Types.ObjectId;
  payload: object;
}