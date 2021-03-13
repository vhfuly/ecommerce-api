import { Document, Schema, model, Model } from 'mongoose';

export interface CategoryDocument extends CategoryInterface, Document {}

const CategorySchema: Schema<CategoryDocument, CategoryModel> = new Schema({

});

export interface CategoryModel extends Model<CategoryDocument> {}
export default model<CategoryDocument, CategoryModel>('Category', CategorySchema)