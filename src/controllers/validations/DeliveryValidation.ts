import Joi from 'joi';
import Product, { ProductDocument } from '@models/Product';
import { Cart } from '@interfaces/Cart';
import { DeliveryInterface } from '@interfaces/Delivery';
import Variation, { VariationDocument } from '@models/Variation';
import { calculateShipping } from '../integrations/correios';
interface CartCorreios {
  variation: VariationDocument;
  product: ProductDocument;
  staticProduct: string;
  amount: number;
  unitPrice: number;
}

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

  checkValueAndDeadline: async(zipCode: string, cart: any , delivery: DeliveryInterface) => {
    try {
      const _cart: CartCorreios[] = await Promise.all(cart.map(async (item: Cart) => {
        item.product = await Product.findById(item.product);
        item.variation= await Variation.findById(item.variation);
        return item;
      }));
      const results = await calculateShipping(zipCode, _cart);
      let found = false;
      results.forEach(result => {
        if (
          result.Codigo.toString()  === delivery.type &&
          Number(result.Valor.replace(/,/g, '.')) === delivery.cost &&
          result.PrazoEntrega === delivery.deadline.toString() 
        ) found = true;
      });
      return found;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export { deliveryValidation }