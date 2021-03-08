import { Document, Schema, model, Model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator';

import { StoreInterface } from '../interfaces/Store';

export interface StoreDocument extends StoreInterface, Document {}

const StoreSchema: Schema<StoreDocument, UserModel> = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  cnpj: { type: String, required: true, unique: true },
  phones: {
    type: [{ type: String }]
  },
  address: {
    type: {
      place: { type: String, required: true },
      number: { type: String, required: true },
      complement: { type: String },
      zipCode: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
    }
  }
},{ timestamps: true });

StoreSchema.plugin(uniqueValidator, { message: 'Is already being used'});

export interface StoreModel extends Model<StoreDocument> {}
export default model<StoreDocument, StoreModel>('Store', StoreSchema)