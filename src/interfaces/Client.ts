import { Types } from 'mongoose';
import { UserDocument } from '@models/User';

export interface ClientInterface {
  user: UserDocument;
  name: string;
  birthDate: Date;
  cpf: string;
  phones: string;
  deleted: boolean;
  store: Types.ObjectId;
  address: Address;
}

export interface Address {
  street: string;
  number: string;
  complement: string;
  zipCode: string;
  city: string;
  state: string;
  district: string;
}