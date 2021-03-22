import Joi from 'joi';
import Product from '@models/Product';
import Variation from '@models/Variation';
import { Cart } from '@interfaces/Cart';
import { PaymentInterface } from '@interfaces/Payment';
import { DeliveryInterface } from '@interfaces/Delivery';



const paymentValidation = {
  show: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),
  },

  pay: {
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object().keys({
      store: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object().keys({
      senderHash: Joi.string().required(),
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
    }),
  },
  
  checkTotalValue: async(cart: Cart[], delivery: DeliveryInterface, payment: PaymentInterface) => {
    try {
      const _cart: Cart[] = await Promise.all(cart.map(async (item) => {
        item.product = await Product.findById(item.product);
        item.variation= await Variation.findById(item.variation);
        return item;
      }));
      let totalValue = delivery.cost;
      totalValue += _cart.reduce((all, item) => all + (item.amount * item.unitPrice), 0);
      return (
        totalValue.toFixed(2) === payment.value.toFixed(2) &&
        ( !payment.parcel || payment.parcel <= 6 )
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  },
    
  checkCard: (payment: PaymentInterface) => {
    if( payment.type === 'creditCard' ){
      return (
        payment.card.name && typeof payment.card.name === 'string' &&
        payment.card.areaCode && typeof payment.card.areaCode === 'string' &&
        payment.card.phone && typeof payment.card.phone === 'string' &&
        payment.card.birthDate && typeof payment.card.birthDate === 'string' &&
        payment.card.creditCardToken && typeof payment.card.creditCardToken === 'string' &&
        payment.card.cpf && typeof payment.card.cpf === 'string'
      );
    } else if( payment.type=== 'ticket' ) return true;
    else return false;
  }
      
};

export { paymentValidation }
