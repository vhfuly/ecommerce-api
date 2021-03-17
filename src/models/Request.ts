import { Document, Schema, model, Model } from 'mongoose';
import { RequestInterface } from '@interfaces/Request';

export interface RequestDocument extends RequestInterface, Document {}

const RequestSchema: Schema<RequestDocument, RequestModel> = new Schema({
  client: {type: Schema.Types.ObjectId, ref:'Client', required: true },
  cart: {
    type: [{
      variation: {type: Schema.Types.ObjectId, ref:'Variation', required: true },
      product: {type: Schema.Types.ObjectId, ref:'Product', required: true  },
      staticProduct: { type: String },
      amount: { type: Number, default: 1 },
      unitPrice: { type: Number, required: true },
    }]
  },
  payment: {type: Schema.Types.ObjectId, ref:'Payment', required: true },
  delivery: {type: Schema.Types.ObjectId, ref:'Delivery', required: true },
  canceled: { type: Boolean, default: false },
  store:  {type: Schema.Types.ObjectId, ref:'Store', required: true  }, 

},{ timestamps: true });

export interface RequestModel extends Model<RequestDocument> {}
export default model<RequestDocument, RequestModel>('Request', RequestSchema);
