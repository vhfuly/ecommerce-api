import { Document, Schema, model, Model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import config from '../config/index';
import { UserInterface } from '../interfaces/User';

interface UserModel extends UserInterface, Document {}

const UserSchema: Schema<UserModel> = new Schema({
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

UserSchema.methods.setPassword = function(password: string): void {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000,512, "sha512").toString("hex");
};

UserSchema.methods.validatePassword = function(password: crypto.BinaryLike): boolean {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
  return hash === this.hash;
};

UserSchema.methods.createToken = function(): object {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 15);

  const token = jwt.sign({
    id: this._id,
    email: this.email,
    name: this.name,
    exp: (exp.getTime() / 1000)
  }, config.secret);
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    store: this.store,
    role: this.permission,
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

export const User: Model<UserModel> =  model<UserModel>("User", UserSchema);
