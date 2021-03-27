import { Document, Schema, model, Model } from 'mongoose';
import { VariationInterface } from '@interfaces/Variation';

export interface VariationDocument extends VariationInterface, Document {}

const VariationSchema: Schema<VariationDocument, VariationModel> = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  photos: { type: Array, default:[] },
  sale: { type: Number },
  delivery: {
    type: {
      dimensions: {
        type: {
          heightCm: { type: Number },
          widthCm: { type: Number },
          depthCm: { type: Number },
        },
        required: true,
      },
      weightKg: { type: Number, required: true },
      freeShipping: { type: Boolean, default: false },
    }
  },
  amount: { type: Number, default: 0 },
  blockedAmount: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
  product: {type: Schema.Types.ObjectId, ref:'Product', required: true }, 
  store: {type: Schema.Types.ObjectId, ref:'Store', required: true }, 
},{ timestamps: true });

export interface VariationModel extends Model<VariationDocument> {}
export default model<VariationDocument, VariationModel>('Variation', VariationSchema);
