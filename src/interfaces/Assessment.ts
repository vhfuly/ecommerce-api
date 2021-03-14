import { Types } from 'mongoose';

export interface AssessmentInterface {
  name: string;
  text: string;
  punctuation: number;
  product: Types.ObjectId;
  store: Types.ObjectId;
}
