import { Types } from 'mongoose';

export interface Cart {
  variation: Types.ObjectId;
  product: Types.ObjectId;
  staticProduct: string;
  amount: number;
  unitPrice: number;
}