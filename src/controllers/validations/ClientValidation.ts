import JoiBase from 'joi';
import Extension from '@joi/date';

const Joi = JoiBase.extend(Extension)

const clientValidation = {
  index: {
    query: Joi.object().keys({
      offset: Joi.number(),
      limit: Joi.number(),
    }),
  },

  search : {
    query: Joi.object().keys({
      offset: Joi.number(),
      limit: Joi.number(),
    }),
    params: Joi.object().keys({
      search: Joi.string().required(),
    }),
  },

  showAdmin: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  updateAdmin: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().optional(),
      cpf: Joi.string().length(14).optional(),
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
      birthDate: Joi.date().format('YYYY-MM-DD').raw().optional(),
    }),
  },

  show: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),
  },

  store: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().required(),
      password: Joi.string().required(),
      cpf: Joi.string().length(14).required(),
      email: Joi.string().email().required(),
      phones: Joi.array().items(Joi.string().required()),
      address: Joi.object({
        place: Joi.string().required(),
        number: Joi.string().required(),
        complement: Joi.string(),
        zipCode: Joi.string().required(),
        city: Joi.string().required(),
        district: Joi.string().required(),
      }).required(),
      birthDate: Joi.date().format('YYYY-MM-DD').raw().required(),
    }),
  },

  update: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().optional(),
      password: Joi.string().optional(),
      cpf: Joi.string().length(14).optional(),
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
      birthDate: Joi.date().format('YYYY-MM-DD').raw().optional(),
    }),
  },

}

export { clientValidation }