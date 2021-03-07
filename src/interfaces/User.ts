export interface UserInterface {
  email: string;
  name: string;
  store: Store;
  permission: Array<string>;
  hash: string;
  salt: string;
  recovery: Recovery;
}

interface Recovery {
  token: String;
  date: Date;
}
