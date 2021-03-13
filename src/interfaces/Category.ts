import { Types } from 'mongoose';

export interface CategoryInterface {
  name: string;
  code: string;
  availability: boolean;
  products: Types.ObjectId[];
  Store: Types.ObjectId,
}