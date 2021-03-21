import { Types } from 'mongoose';
import { Address } from '@interfaces/Client';

export interface PaymentInterface {
  value: number;
  type: string;
  parcel: number;
  purchase: Types.ObjectId;
  store: Types.ObjectId;
  payload: Array<any>;
  address: Address;
  card: Card;
  sameBillingAddress: boolean;
  pagseguroCode: string;
}

interface Card {
  name: string;
  areaCode: string;
  phone: string;
  birthDate: string;
  creditCardToken: string;
  cpf: string;
}