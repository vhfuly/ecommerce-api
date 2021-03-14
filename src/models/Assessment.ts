import { Document, Schema, model, Model } from 'mongoose';


export interface AssessmentDocument extends AssessmentInterface, Document {}

const AssessmentSchema: Schema<AssessmentDocument, AssessmentModel> = new Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  punctuation: { type: Number, default: 1 },
  product: {type: Schema.Types.ObjectId, ref:'Product' }, 
  store: {type: Schema.Types.ObjectId, ref:'Store' }, 

},{ timestamps: true });

export interface AssessmentModel extends Model<AssessmentDocument> {}
export default model<AssessmentDocument, AssessmentModel>('Assessment', AssessmentSchema);