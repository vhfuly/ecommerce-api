import Joi from 'joi';

const variationValidation = { 
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
      code: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      sale: Joi.number().optional(),
      delivery: Joi.object({
        dimensions: Joi.object({
          heightCm: Joi.number().required(),
          widthCm: Joi.number().required(),
          depthCm: Joi.number().required(),
        }).required(),
        weightKg: Joi.number().required(),
        freeShipping: Joi.boolean().optional(),
      }).required(),
      amount: Joi.number().optional(),
    }),
  },

  update: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      product: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object().keys({
      code: Joi.string().optional(),
      name: Joi.string().optional(),
      price: Joi.number().optional(),
      sale: Joi.number().optional(),
      availability: Joi.boolean().optional(),
      delivery: Joi.object({
        dimensions: Joi.object({
          heightCm: Joi.number().required(),
          widthCm: Joi.number().required(),
          depthCm: Joi.number().required(),
        }).required(),
        weightKg: Joi.number().required(),
        freeShipping: Joi.boolean().optional(),
      }).optional(),
      amount: Joi.number().optional(),
    }),
  },

  updateImages: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      product: Joi.string().alphanum().length(24).required(),
    }),
  },

  removeImage: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      product: Joi.string().alphanum().length(24).required(),
      file: Joi.string().required(),
    }),
  },

  remove: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      product: Joi.string().alphanum().length(24).required(),
    }),
  }
}

export { variationValidation };