export interface ClientInterface {
  user: string;
  name: string;
  birthDate: Date;
  cpf: string;
  phones: string;
  deleted: boolean;
  store: string;
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