import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express'

import User, { sendAuthJSON, setPassword } from '../models/User';
import sendEmailRecovery from '../helpers/email-recovery';

class UserController {
  index(request: Request, response: Response , next: NextFunction) {
    User.findById(request.body.id).then(user => {
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
}

export { UserController };
