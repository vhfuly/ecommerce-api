import Joi from 'joi';
import Extension from '@joi/date';

const JoiDate = Joi.extend(Extension);

const clientValidation = {
  index: {
    query: Joi.object().keys({
      offset: Joi.number(),
      limit: Joi.number(),
      store: Joi.string().alphanum().length(24).required(),
    }),
  },

  searchPurchase : {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      offset: Joi.number(),
      limit: Joi.number(),
    }),
    params: Joi.object().keys({
      search: Joi.string().required(),
    }),
  },

  search : {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      offset: Joi.number(),
      limit: Joi.number(),
    }),
    params: Joi.object().keys({
      search: Joi.string().required(),
    }),
  },

  showPurchaseAdmin : {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      offset: Joi.number(),
      limit: Joi.number(),
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
        street: Joi.string().required(),
        number: Joi.string().required(),
        complement: Joi.string(),
        zipCode: Joi.string().required(),
        city: Joi.string().required(),
        district: Joi.string().required(),
        state: Joi.string().required(),
      }).optional(),
      birthDate: JoiDate.date().format('YYYY-MM-DD').optional(),
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
      birthDate: JoiDate.date().format('YYYY-MM-DD').required(),
      phones: Joi.array().items(Joi.string()).required(),
      address: Joi.object({
        street: Joi.string().required(),
        number: Joi.string().required(),
        complement: Joi.string(),
        zipCode: Joi.string().required(),
        city: Joi.string().required(),
        district: Joi.string().required(),
        state: Joi.string().required(),
      }).required(),
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
        street: Joi.string().required(),
        number: Joi.string().required(),
        complement: Joi.string(),
        zipCode: Joi.string().required(),
        city: Joi.string().required(),
        district: Joi.string().required(),
        state: Joi.string().required(),
      }).optional(),
      birthDate: JoiDate.date().format('YYYY-MM-DD').optional(),
    }),
  },

}

export { clientValidation }