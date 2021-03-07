import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express'

import User from '../models/User';
import sendEmailRecovery from '../helpers/email-recovery';

import { setPassword, sendAuthJSON, validatePassword, createTokenRecoveryPassword, finishTokenRecoveryPassword } from '../utils/password';
import { usersRouter } from '../routes/api/v1/Users';

class UserController {
  index(request: Request, response: Response , next: NextFunction) {
    User.findById(request.headers.id).then(user => {
      if(!user) return response.status(401).json({ error: "Unregistered user" });
      return response.json({ user: sendAuthJSON(user) })
    }).catch(next);
  }

  show(request: Request, response: Response , next: NextFunction) {
    User.findById(request.params.id).populate({ path: 'store'}).then(user => {
      if(!user) return response.status(401).json({ error: "Unregistered user" });
      return response.json({
        user: {
          name: user.name,
          email: user.email,
          permission: user.permission,
          store: user.store,
        }
      })
    }).catch(next);
  }


  store(request: Request, response: Response , next: NextFunction) {
    const {name, email, password } = request.body

    const { salt, hash }  = setPassword(password)
    const user = new User({ name , email, salt, hash });
    user.save()
      .then(() => response.json({ user: sendAuthJSON(user) }))
      .catch(next);
  }

  update(request: Request, response: Response , next: NextFunction) {
    const {name, email, password } = request.body
    User.findById(request.headers.id).then(user => {
      if(!user) return response.status(401).json({ error: "Unregistered user" });
      if (typeof name !== 'undefined') user.name = name;
      if (typeof email !== 'undefined') user.email = email;
      if (typeof password !== 'undefined') {
        const { salt, hash }  = setPassword(password);
        user.salt = salt;
        user.hash = hash;
      }
      user.save()
        .then(() => response.json({ user: sendAuthJSON(user) }))
        .catch(next);
    }).catch(next);
  }

  remove(request: Request, response: Response , next: NextFunction) {
    User.findById(request.headers.id).then(user => {
      if(!user) return response.status(401).json({ error: "Unregistered user" });
      return user.remove().then(() => {
        return response.json({ deleted: true });
      }).catch(next);
    }).catch(next);
  }

  login(request: Request, response: Response , next: NextFunction) {
    const { email, password } =request.body;
    User.findOne({ email }).then((user) => {
      if(!user) return response.status(401).json({ error: "Unregistered user" });
      if(validatePassword(password, user)) return response.status(401).json({ error: 'invalid password' });
      return response.json({ user: sendAuthJSON(user) });
    }).catch(next);
  }

  // RECOVERY

  showRecovery(request: Request, response: Response , next: NextFunction) {
    return response.render('recovery', { error: null, success: null });
  }


  createRecovery(request: Request, response: Response , next: NextFunction) {
    const { email } = request.body;
    if(!email) return response.render('recovery', { error: 'Fill in with your email', success: null });

    User.findOne({ email }).then((user) => {
      if(!user) return response.render("recovery", { error: 'There is no user with this email', success: null });
      const recoveryData = createTokenRecoveryPassword(user);
      return user.save().then(() => {
        sendEmailRecovery({ user, recovery: recoveryData }, (error = null, success = null) => {
          return response.render('recovery', { error, success });
        });
      }).catch(next);
    }).catch(next);
  }

  showCompleteRecovery(request: Request, response: Response , next: NextFunction) {
    if(!request.query.token) return response.render('recovery', { error: 'Unidentified token', success: null });
    User.findOne({ 'recovery.token': request.query.token }).then(user => {
      if(!user) return response.render('recovery', { error: 'There is no user with this token', success: null });
      if( new Date(user.recovery.date) < new Date() ) return response.render('recovery', { error: 'Expired token. Try again.', success: null });
      return response.render('recovery/store', { error: null, success: null, token: request.query.token });
    }).catch(next);
  }

  completeRecovery(request: Request, response: Response , next: NextFunction) {
    const { token, password } = request.body;
    if(!token || !password) return response.render('recovery/store', { error: 'Please fill in again with your new password', success: null, token: token });
    User.findOne({ 'recovery.token': token }).then(user => {
      if(!user) return response.render('recovery', { error: 'Unidentified user', success: null });

      finishTokenRecoveryPassword(user);
      const { salt, hash }  = setPassword(password);
      user.salt = salt;
      user.hash = hash;
      return user.save().then(() => {
          return response.render('recovery/store', {
              error: null,
              success: 'Password changed successfully. Try logging in again...',
              token: null
          });
      }).catch(next);
    });
  }

}

export { UserController };
