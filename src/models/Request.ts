import { Document, Schema, model, Model } from 'mongoose';

export interface RequestDocument extends RequestInterface, Document {}

const RequestSchema: Schema<RequestDocument, RequestModel> = new Schema({
  client: {type: Schema.Types.ObjectId, ref:'Client', required: true },
  cart: [{
    variation: {type: Schema.Types.ObjectId, ref:'Variation', required: true },
    product: {type: Schema.Types.ObjectId, ref:'Product', required: true  },
    amount: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
  }]

},{ timestamps: true });

export interface RequestModel extends Model<RequestDocument> {}
export default model<RequestDocument, RequestModel>('Request', RequestSchema);
