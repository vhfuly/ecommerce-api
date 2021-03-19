import { Types } from 'mongoose';
import { Cart } from './Cart';

export interface PurchaseInterface {
  client: Types.ObjectId,
  cart: Cart[];
  payment: Types.ObjectId;
  delivery: Types.ObjectId;
  canceled: boolean;
  store: Types.ObjectId;
}
