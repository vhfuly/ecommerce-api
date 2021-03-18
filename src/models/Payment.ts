import { Document, Schema, model, Model } from 'mongoose'
import { PaymentInterface } from '@interfaces/Payment';

export interface PaymentDocument extends PaymentInterface, Document {}

const PaymentSchema: Schema<PaymentDocument, PaymentModel> = new Schema({
  value: { type: Number, required: true },
  type: { type: String, required: true },
  parceled: { type: Object },
  purchase: { type: Schema.Types.ObjectId, ref: "Purchase", required: true },
  store: { type: Schema.Types.ObjectId, ref: "store", required: true },
  payload: { type: Object }
},{ timestamps: true });


export interface PaymentModel extends Model<PaymentDocument> {}
export default model<PaymentDocument, PaymentModel>('Payment', PaymentSchema)