import { Document, Schema, model, Model } from 'mongoose';
import { PurchasesRecordInterface } from '@interfaces/PurchasesRecord';

export interface PurchasesRecordDocument extends PurchasesRecordInterface, Document {}

const PurchasesRecordSchema: Schema<PurchasesRecordDocument, PurchasesRecordModel> = new Schema({
  purchase: { type: Schema.Types.ObjectId, ref:'Purchase', required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  payload: { type: Object },
},{ timestamps: true });

export interface PurchasesRecordModel extends Model<PurchasesRecordDocument> {}
export default model<PurchasesRecordDocument, PurchasesRecordModel>('PurchasesRecord', PurchasesRecordSchema);
