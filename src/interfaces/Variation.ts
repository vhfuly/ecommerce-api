import { Types } from 'mongoose';


export interface VariationInterface {
  code: string;
  name: string;
  price: number;
  photos: Array<string>;
  sale: number;
  delivery: {
    dimensions: {
      heightCm: number;
      widthCm: number;
      depthCm: number;
    },
    weightKg: number;
    freeShipping: boolean;
  }
  amount: number;
  product: Types.ObjectId;
  store: Types.ObjectId;
  availability?: boolean,
}
