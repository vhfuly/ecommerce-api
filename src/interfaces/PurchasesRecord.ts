import { Types } from 'mongoose';

export interface PurchasesRecordInterface {
  purchase: Types.ObjectId;
  type: string;
  status: string;
  date: Date;
  payload: object;
}
