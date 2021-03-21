import { Types } from 'mongoose';

export interface DeliveryInterface {
  status: string;
  trackingCode: string;
  type: string;
  cost: number;
  deadline: number;
  purchase: Types.ObjectId;
  store: Types.ObjectId;
  address: Address;
  payload: object;
}

interface Address {
  street: string;
  number: string;
  complement: string;
  zipCode: string;
  city: string;
  state: string;
  district: string;
}