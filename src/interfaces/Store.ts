export interface StoreInterface {
  readonly _id: string;
  name: string;
  email: string;
  cnpj: string;
  phones: string;
  address: Address;
}

interface Address {
  place: string;
  number: string;
  complement: string;
  zipCode: string;
  city: string;
  district: string;
}