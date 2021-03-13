import { Document, Schema, model, Model } from 'mongoose';
import { CategoryInterface } from '@interfaces/Category';

export interface CategoryDocument extends CategoryInterface, Document {}

const CategorySchema: Schema<CategoryDocument, CategoryModel> = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  availability: { type: Boolean, default: true },
  products: { type: [{type: Schema.Types.ObjectId, ref:'product' }]},
  store: {type: Schema.Types.ObjectId, ref:'store' }, 
},{ timestamps: true });

export interface CategoryModel extends Model<CategoryDocument> {}
export default model<CategoryDocument, CategoryModel>('Category', CategorySchema)