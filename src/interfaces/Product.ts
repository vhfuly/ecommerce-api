import { Types } from 'mongoose';

export interface ProductInterface {
  title: string;
  availability: boolean;
  description: string;
  photos: Array<string>;
  price: number
  sale: number;
  sku: string;
  category:  Types.ObjectId;
  store:  Types.ObjectId;
  assessments: Types.ObjectId[];
  variations: Types.ObjectId[];
  products: Types.ObjectId[];
}