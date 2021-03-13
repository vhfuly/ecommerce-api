import { Document, Schema, model, Model } from 'mongoose';
import { ProductInterface } from '@interfaces/Product';


export interface ProductDocument extends ProductInterface, Document {}

const ProductSchema: Schema<ProductDocument, ProductModel> = new Schema({
  title: { type: String, required: true },
  availability: { type: Boolean, default: true },
  description: { type: String , required: true },
  photos: { type: Array, default:[] },
  price: { type: Number, required: true },
  sale: { type: Number },
  sku: { type: String , required: true },
  category:  {type: Schema.Types.ObjectId, ref:'Category' }, 
  store:  {type: Schema.Types.ObjectId, ref:'Store' }, 
  assessments: {type: [{type: Schema.Types.ObjectId, ref:'Assessment' }]},
  variations: {type: [{type: Schema.Types.ObjectId, ref:'Variation' }]},
},{ timestamps: true });

export interface ProductModel extends Model<ProductDocument> {}
export default model<ProductDocument, ProductModel>('Product', ProductSchema);
