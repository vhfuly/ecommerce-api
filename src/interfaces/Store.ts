export interface StoreInterface {
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