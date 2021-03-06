import { Types } from 'mongoose';
import { VariationDocument } from '@models/Variation';
import { ProductDocument } from '@models/Product';

export interface Cart {
  variation: VariationDocument;
  product: Types.ObjectId | ProductDocument;
  staticProduct: string;
  amount: number;
  unitPrice: number;
}