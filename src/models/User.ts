import { Document, Schema, model, Model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator';

import { UserInterface } from '@interfaces/User';

export interface UserDocument extends UserInterface, Document {}

const UserSchema: Schema<UserDocument, UserModel> = new Schema({
  name: {
    type: String,
    required: [true,'can not spin empty'],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true,'can not spin empty'],
    index: true,
    match: [/\S+@\S+\.\S+/, 'is invalid.']
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: [true,'can not spin empty']
  },
  permission: {
      type: Array,
      default: ['client']
  },
  hash: { type: String },
  salt: { type: String },
  recovery: {
    type: {
      token: String ,
      date: Date
    },
    default: {}
  }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'Is already being used'});

export interface UserModel extends Model<UserDocument> {}
export default model<UserDocument, UserModel>('User', UserSchema)
