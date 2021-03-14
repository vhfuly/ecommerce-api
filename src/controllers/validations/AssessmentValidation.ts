import Joi from 'joi';

const assessmentValidation = {
  index: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      product: Joi.string().alphanum().length(24).required(),
    }),
  },

  show: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      product: Joi.string().alphanum().length(24).required(),
    }),
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  store: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      product: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().required(),
      text: Joi.string().required(),
      punctuation: Joi.number().min(1).max(5).required(),
    }),
  },

  remove: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
}

export { assessmentValidation }