import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import User from '@models/User';

const storeValidation = { 
  admin: async (request: Request, response: Response , next: NextFunction) => {
    if(!request.payload.id) return response.sendStatus(401);
    const { store } = request.query;
    if(!store) return response.sendStatus(401);
    try {
      const user = await User.findById(request.payload.id);
      if(!user) return response.sendStatus(401);
      if(!user.store) return response.sendStatus(401);
      if(!user.permission.indexOf('admin')) return response.sendStatus(401);
      if(user.store.toString() !== store) return response.sendStatus(401);
      next();
    } catch (error) {
      response.status(500).json({ Error: 'Error when checking authentication' });
    }
  },

  show: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  store: {
    body: Joi.object().keys({
      name: Joi.string().required(),
      cnpj: Joi.string().length(18).required(),
      email: Joi.string().email().required(),
      phones: Joi.array().items(Joi.string()).required(),
      address: Joi.object({
        place: Joi.string().required(),
        number: Joi.string().required(),
        complement: Joi.string(),
        zipCode: Joi.string().required(),
        city: Joi.string().required(),
        district: Joi.string().required(),
      }).required(),
    }),
  }, 

  update: {
    body: Joi.object().keys({
      name: Joi.string().optional(),
      cnpj: Joi.string().length(18).optional(),
      email: Joi.string().email().optional(),
      phones: Joi.array().items(Joi.string().optional()),
      address: Joi.object({
        place: Joi.string().required(),
        number: Joi.string().required(),
        complement: Joi.string(),
        zipCode: Joi.string().required(),
        city: Joi.string().required(),
        district: Joi.string().required(),
      }).optional(),
    }),
  }
  
}

export { storeValidation }