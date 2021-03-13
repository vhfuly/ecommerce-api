import { Types } from 'mongoose';

export interface ClientInterface {
  user: Types.ObjectId;
  name: string;
  birthDate: Date;
  cpf: string;
  phones: string;
  deleted: boolean;
  store: Types.ObjectId;
  address: Address;
}

interface Address {
  place: string;
  number: string;
  complement: string;
  zipCode: string;
  city: string;
  state: string;
  district: string;
}