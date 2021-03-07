export interface UserInterface {
  email: string;
  name: string;
  store: string;
  permission: Array<string>;
  hash: string;
  salt: string;
  recovery: Recovery;
}

interface Recovery {
  token: string | undefined;
  date: Date | undefined;
}
