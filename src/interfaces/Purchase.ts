import { Types } from 'mongoose';
import { Cart } from './Cart';
import { ClientInterface } from './Client';

export interface PurchaseInterface {
  client: Types.ObjectId ,
  cart: Cart[];
  payment: Types.ObjectId;
  delivery: Types.ObjectId;
  canceled: boolean;
  store: Types.ObjectId;
  createdAt?: Date;
  updateAt?: Date;
}
