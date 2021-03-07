import { Document, Schema, model, Model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import config from '../config/index';
import { UserInterface } from '../interfaces/User';

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
      token: String,
      date: Date
    },
    default: {}
  }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'Is already being used'});

UserSchema.methods.validatePassword = function(password: crypto.BinaryLike): boolean {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
  return hash === this.hash;
};

// RECOVERY
UserSchema.methods.createTokenRecoveryPassword = function(): object{
  this.recovery.token = crypto.randomBytes(16).toString("hex");
  this.recovery.date = new Date( new Date().getTime() + 24*60*60*1000 );
  return this.recovery;
};

UserSchema.methods.finishTokenRecoveryPassword = function(): object{
  this.recovery = { token: null, date: null };
  return this.recovery;
};

export interface UserModel extends Model<UserDocument> {}
export default model<UserDocument, UserModel>("User", UserSchema)
