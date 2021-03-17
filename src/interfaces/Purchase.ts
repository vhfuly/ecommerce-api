import { Types } from 'mongoose';

interface Cart {
  variation: Types.ObjectId;
  product: Types.ObjectId;
  staticProduct: string;
  amount: number;
  unitPrice: number;
}

export interface PurchaseInterface {
  client: Types.ObjectId,
  cart: Cart[];
  payment: Types.ObjectId;
  delivery: Types.ObjectId;
  canceled: boolean;
  store: Types.ObjectId;
}
