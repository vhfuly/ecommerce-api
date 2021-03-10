import Joi from 'joi';

const UserValidation = {
  show: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  store: {
    params: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      store: Joi.string().alphanum().length(24).required(),
    }),
  },

  update: {
    body: Joi.object().keys({
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().optional(),
    }),
  },

  login: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }

}

export { UserValidation }
