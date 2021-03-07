import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express'

import User from '../models/User';
import sendEmailRecovery from '../helpers/email-recovery';
import { setPassword, sendAuthJSON } from '../utils/password';

class UserController {
  index(request: Request, response: Response , next: NextFunction) {
    User.findById(request.headers.id).then(user => {
      if(!user) return response.status(401).json({ errors: "Unregistered user" });
      return response.json({ user: sendAuthJSON(user) })
    }).catch(next);
  }

  show(request: Request, response: Response , next: NextFunction) {
    User.findById(request.params.id).populate({ path: 'store'}).then(user => {
      if(!user) return response.status(401).json({ errors: "Unregistered user" });
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
      if(!user) return response.status(401).json({ errors: "Unregistered user" });
      if (typeof name !== 'undefined') user.name = name;
      if (typeof email !== 'undefined') user.email = email;
      if (typeof password !== 'undefined') {
        const { salt, hash }  = setPassword(password)
        user.salt = salt;
        user.hash = hash;
      }
      user.save()
        .then(() => response.json({ user: sendAuthJSON(user) }))
        .catch(next);
    }).catch(next);
  }

}

export { UserController };
