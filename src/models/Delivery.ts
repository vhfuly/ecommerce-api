import { Document, Schema, model, Model } from 'mongoose'
import { DeliveryInterface } from '@interfaces/Delivery';

export interface DeliveryDocument extends DeliveryInterface, Document {}

const DeliverySchema: Schema<DeliveryDocument, DeliveryModel> = new Schema({
  status: { type: String, required: true },
  trackingCode: { type: String },
  type: { type: String, required: true },
  cost: { type: Number, required: true },
  deadline: { type: Number, required: true },
  address: {
      type: {
          street: { type: String, required: true },
          number: { type: String, required: true },
          complement: { type: String },
          district: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          ZipCode: { type: String, required: true }
      },
      required: true
  },
  purchase: { type: Schema.Types.ObjectId, ref: "Purchase", required: true },
  store: { type: Schema.Types.ObjectId, ref: "store", required: true },
  payload: { type: Object }
},{ timestamps: true });


export interface DeliveryModel extends Model<DeliveryDocument> {}
export default model<DeliveryDocument, DeliveryModel>('Delivery', DeliverySchema)