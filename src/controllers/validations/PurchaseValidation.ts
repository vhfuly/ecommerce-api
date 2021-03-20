import Joi from 'joi';

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
      }).required(),
      delivery: Joi.object({
        cost: Joi.number().required(),
        deadline: Joi.number().required(),
        type: Joi.string().required(),
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