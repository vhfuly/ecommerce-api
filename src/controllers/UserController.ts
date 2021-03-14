import { Request, Response, NextFunction } from 'express';

import User, { UserDocument } from '@models/User';
import sendEmailRecovery from '../helpers/emailRecovery';


import {
  setPassword,
  sendAuthJSON,
  validatePassword,
  createTokenRecoveryPassword,
  finishTokenRecoveryPassword,
} from '../utils/password';

class UserController {
  async index(request: Request , response: Response, next: NextFunction) {
    try {
      const user: UserDocument = await User.findById(request.payload.id);
      if (!user) return response.status(401).json({ error: 'Unregistered user' });
      return response.json({ user: sendAuthJSON(user) });
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    try {
      const user: UserDocument = await User.findById(id);
      // .populate({ path: 'store'})
      if (!user) return response.status(401).json({ error: 'Unregistered user' });
      return response.json({
        user: {
          name: user.name,
          email: user.email,
          permission: user.permission,
          store: user.store,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async store(request: Request, response: Response, next: NextFunction) {
    const { name, email, password, store } = request.body;
    try {
      const { salt, hash } = setPassword(password);
      const account = await User.findOne({ email });
      if (account) return response.status(422).json({ error: 'The email already has an account' });
      const user: UserDocument = new User({
        name, email, salt, hash, store,
      });
      response.json({ user: sendAuthJSON(user) });
      await user.save();
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, email, password } = request.body;
    try {
      const user: UserDocument = await User.findById(request.payload.id);
      if (!user) return response.status(401).json({ error: 'Unregistered user' });
      if (typeof name !== 'undefined') user.name = name;
      if (typeof email !== 'undefined') user.email = email;
      if (typeof password !== 'undefined') {
        const { salt, hash } = setPassword(password);
        user.salt = salt;
        user.hash = hash;
      }
      console.log(user);
      await user.save();
      response.json({ user: sendAuthJSON(user) });
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const user: UserDocument = await User.findById(request.payload.id);
      if (!user) return response.status(401).json({ error: 'Unregistered user' });
      await user.remove();
      return response.json({ deleted: true });
    } catch (error) {
      next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;
    try {
      const user: UserDocument = await User.findOne({ email });
      if (!user) return response.status(401).json({ error: 'Unregistered user' });
      if (!validatePassword(password, user)) return response.status(401).json({ error: 'invalid password' });
      return response.json({ user: sendAuthJSON(user) });
    } catch (error) {
      next(error);
    }
  }

  // RECOVERY

  showRecovery(_request: Request, response: Response, next: NextFunction) {
    return response.render('recovery', { error: null, success: null });
  }

  async createRecovery(request: Request, response: Response, next: NextFunction) {
    const { email } = request.body;
    try {
      if (!email) return response.render('src/recovery', { error: 'Fill in with your email', success: null });
      const user: UserDocument = await User.findOne({ email });
      if (!user) return response.render('recovery', { error: 'There is no user with this email', success: null });
      const recoveryData = createTokenRecoveryPassword(user);
      sendEmailRecovery({ user, recovery: recoveryData }, (error = null, success = null) => response.render('recovery', { error, success }));
    } catch (error) {
      next(error);
    }
  }

  async showCompleteRecovery(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.query.token) return response.render('recovery', { error: 'Unidentified token', success: null });
      const user: UserDocument = await User.findOne({ 'recovery.token': request.query.token });
      if (!user) return response.render('recovery', { error: 'There is no user with this token', success: null });
      if (new Date(user.recovery.date) < new Date()) return response.render('recovery', { error: 'Expired token. Try again.', success: null });
      return response.render('recovery/store', { error: null, success: null, token: request.query.token });
    } catch (error) {
      next(error);
    }
  }

  async completeRecovery(request: Request, response: Response, next: NextFunction) {
    const { token, password } = request.body;
    try {
      if (!token || !password) return response.render('recovery/store', { error: 'Please fill in again with your new password', success: null, token });
      const user: UserDocument = await User.findOne({ 'recovery.token': token });
      if (!user) return response.render('recovery', { error: 'Unidentified user', success: null });

      finishTokenRecoveryPassword(user);
      const { salt, hash } = setPassword(password);
      user.salt = salt;
      user.hash = hash;
      await user.save();
      return response.render('recovery/store', {
        error: null,
        success: 'Password changed successfully. Try logging in again...',
        token: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { UserController };
