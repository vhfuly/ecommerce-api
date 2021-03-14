import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const productValidation = { 
  store: {
    body: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().alphanum().length(24).required(),
      price: Joi.number().required(),
      sale: Joi.number(),
      sku: Joi.string().required(), 
    }),
  },

  update: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object().keys({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      category: Joi.string().alphanum().length(24).optional(),
      price: Joi.number().optional(),
      sale: Joi.number(),
      sku: Joi.string().optional(),
      availability: Joi.boolean().optional(),
    }),
  },

  updateImages: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  remove: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  index: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      limit: Joi.number(),
      offset: Joi.number(),
      sortType: Joi.string(),
    }),
  },

  indexAvailable: {
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      limit: Joi.number(),
      offset: Joi.number(),
      sortType: Joi.string(),
    }),
  },

  search: {
    params: Joi.object().keys({
      search: Joi.string().required(),
    }),
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
      limit: Joi.number(),
      offset: Joi.number(),
      sortType: Joi.string(),
    }),
  },

  show: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  showAssessments: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
};

export { productValidation };