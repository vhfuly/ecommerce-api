import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { UserDocument } from '@models/User';
import config from '@config/index';


export const setPassword = function(password: string): {salt: string , hash: string} {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000,512, "sha512").toString("hex");
  return { 
    salt, 
    hash
  }
};

export const validatePassword = function(password: string, user: UserDocument): boolean {
  const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, "sha512").toString("hex");
  return hash === user.hash;
};

export const createTokenRecoveryPassword = function(user: UserDocument): {token: string, date: Date}{
  user.recovery.token = crypto.randomBytes(16).toString("hex");
  user.recovery.date = new Date( new Date().getTime() + 24*60*60*1000 );
  return {
    token: user.recovery.token,
    date: user.recovery.date
  }
};

export const finishTokenRecoveryPassword = function(user: UserDocument): object{
  user.recovery = { token: null, date: null };
  return user.recovery;
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