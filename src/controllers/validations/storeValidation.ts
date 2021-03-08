import { Request, Response, NextFunction } from 'express';

import Store from '../../models/Store';
import User from '../../models/User';

async function storeValidation(request: Request, response: Response , next: NextFunction) {
  if(!request.headers.id) return response.sendStatus(401);
  const { store } = request.query;
  if(!store) return response.sendStatus(401);
  try {
    const user = await User.findById(request.headers.id);
    if(!user) return response.sendStatus(401);
    if(!user.store) return response.sendStatus(401);
    if(!user.permission.indexOf('admin')) return response.sendStatus(401);
    if(user.store !== store) return response.sendStatus(401);
    next();
  } catch (error) {
    response.status(500).json({ Error: 'Error when checking authentication' });
  }

  
}

export { storeValidation }