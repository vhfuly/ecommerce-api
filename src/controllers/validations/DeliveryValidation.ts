import Joi from 'joi';
import { inflateSync } from 'zlib';

const deliveryValidation = {
  show: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),
  },

  update: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object().keys({
      status: Joi.string().optional(),
      trackingCode: Joi.string().optional(),
    }),
  },

  calculate: {
    body: Joi.object().keys({
      zipCode: Joi.string().required(),
      cart: Joi.array().items(Joi.object({
        product: Joi.string().alphanum().length(24).required(),
        variation: Joi.string().alphanum().length(24).required(),
        amount: Joi.number().optional(),
        unitPrice: Joi.number().optional(),
      })).optional(),
    }),
  },
}

export { deliveryValidation }