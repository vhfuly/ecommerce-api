import Joi from 'joi';
import Extension from '@joi/date';

const JoiDate = Joi.extend(Extension);

const purchaseValidation = { 
  indexAdmin: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      limit: Joi.number(),
      offset: Joi.number(),
    }),
  },

  showAdmin: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  removeAdmin: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  showCartPurchaseAdmin: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  index: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      limit: Joi.number(),
      offset: Joi.number(),
    }),
  },

  show: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  store: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),

    body: Joi.object().keys({
      cart: Joi.array().items(Joi.object({
        variation: Joi.string().alphanum().length(24).required(),
        product: Joi.string().alphanum().length(24).required(),
        amount:  Joi.number().required(),
        unitPrice:  Joi.number().required(),
      })).required(),
      payment: Joi.object({
        value:  Joi.number().required(),
        type:  Joi.string().required(),
        parcel: Joi.number().optional(),
        sameBillingAddress: Joi.boolean().required(),
        address: Joi.object({
          street: Joi.string().required(),
          number: Joi.string().required(),
          complement: Joi.string(),
          zipCode: Joi.string().required(),
          city: Joi.string().required(),
          district: Joi.string().required(),
          state: Joi.string().required(),
        }).required(),
        card: Joi.object({
          name: Joi.string().required(),
          areaCode: Joi.string().required(),
          phone: Joi.string().required(),
          birthDate: JoiDate.date().format('DD/MM/YYYY').required(),
          creditCardToken: Joi.string().required(),
          cpf: Joi.string().required(),
        }).optional(),
      }).required(),
      delivery: Joi.object({
        cost: Joi.number().required(),
        deadline: Joi.number().required(),
        type: Joi.string().required(),
        address: Joi.object({
          street: Joi.string().required(),
          number: Joi.string().required(),
          complement: Joi.string(),
          zipCode: Joi.string().required(),
          city: Joi.string().required(),
          district: Joi.string().required(),
          state: Joi.string().required(),
        }).required(),
      }).required(),
    }),
  },

  remove: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  showCartPurchase: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
}

export { purchaseValidation }