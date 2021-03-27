import { Cart } from './Cart';
import { ClientDocument } from '@models/Client';
import { PaymentDocument } from '@models/Payment';
import { DeliveryDocument } from '@models/Delivery';
import { StoreDocument } from '@models/Store';

export interface PurchaseInterface {
  client: ClientDocument,
  cart: Cart[];
  payment: PaymentDocument;
  delivery: DeliveryDocument;
  canceled: boolean;
  store: StoreDocument | string;
  createdAt?: Date;
  updateAt?: Date;
}
