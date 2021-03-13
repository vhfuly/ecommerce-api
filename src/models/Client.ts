import { Document, Schema, model, Model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate';
import { ClientInterface } from '@interfaces/Client';

export interface ClientDocument extends ClientInterface, Document {
  _doc: any;
}

const ClientSchema: Schema<ClientDocument, ClientModel> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true},
  name: { type: String, required: true},
  birthDate: { type: Date, required: true},
  cpf: { type: String, required: true},
  phones: {
    type: [{ type: String }]
  },
  deleted: { type: Boolean, default: false },
  store: { type: Schema.Types.ObjectId, ref: "Store", required: true},
  address: {
    type: {
      place: { type: String, required: true },
      number: { type: String, required: true },
      complement: { type: String },
      zipCode: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      district: { type: String, required: true },
    }
  }
},{ timestamps: true });

// ClientSchema.plugin(mongoosePaginate);

export interface ClientModel extends Model<ClientDocument> {}
export default model<ClientDocument, ClientModel>('Client', ClientSchema)