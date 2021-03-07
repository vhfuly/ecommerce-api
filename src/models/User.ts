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

export const setPassword = function(password: string): {salt: string , hash: string} {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000,512, "sha512").toString("hex");
  console.log(hash)
  return { 
    salt, 
    hash
  }
};

UserSchema.methods.validatePassword = function(password: crypto.BinaryLike): boolean {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
  return hash === this.hash;
};

export const sendAuthJSON = function(user: UserDocument): object {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 15);

  const token = jwt.sign({
    id: user._id,
    email: user.email,
    name: user.name,
    exp: (exp.getTime() / 1000)
  }, config.secret);
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    store: user.store,
    role: user.permission,
    token: token
  };
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
