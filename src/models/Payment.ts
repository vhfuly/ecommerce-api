import { Document, Schema, model, Model } from 'mongoose'
import { PaymentInterface } from '@interfaces/Payment';

export interface PaymentDocument extends PaymentInterface, Document {}

const PaymentSchema: Schema<PaymentDocument, PaymentModel> = new Schema({
  value: { type: Number, required: true },
  type: { type: String, required: true },
  parcel: { type: Number, dafault: 1 },
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
  card: {
    type: {
      name: { type: String, required: true },
      areCode: { type: String, required: true },
      phone: { type: String, required: true},
      birthDate: { type: String, required: true },
      creditCardToken: { type: String, required: true },
      cpf: { type: String, required: true },
    },
  },
  sameBillingAddress: { type: Boolean, default: true},
  purchase: { type: Schema.Types.ObjectId, ref: "Purchase", required: true },
  store: { type: Schema.Types.ObjectId, ref: "store", required: true },
  payload: { type: Array },
  pagseguroCode: { type: String },
},{ timestamps: true });


export interface PaymentModel extends Model<PaymentDocument> {}
export default model<PaymentDocument, PaymentModel>('Payment', PaymentSchema)