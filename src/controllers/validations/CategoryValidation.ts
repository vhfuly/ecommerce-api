import Joi from 'joi';

const categoryValidation = {
  index: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),
  },

  indexAvailable: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),
  },

  show: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  store: {
    body: Joi.object().keys({
      name: Joi.string().required(),
      code: Joi.string().required(),
    }),
  },

  update: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().optional(),
      code: Joi.string().optional(),
      availability: Joi.boolean().optional(),
      products: Joi.array().items(Joi.string().alphanum().length(24).required()).optional,
    }),
  },

  remove: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  showProducts: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object().keys({
      limit: Joi.number(),
      offset: Joi.number(),
    }),
  },

  updateProducts: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object().keys({
      products: Joi.array().items(Joi.string().alphanum().length(24).required()).optional,
    }),
  },

}

export { categoryValidation }