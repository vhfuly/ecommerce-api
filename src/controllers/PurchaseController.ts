import { Request, Response, NextFunction } from 'express';

import Purchase from '@models/Purchase';
import Client from '@models/Client';
import Product from '@models/Product';
import Delivery from '@models/Delivery';
import Payment from '@models/Payment';
import Variation from '@models/Variation';
import { CartValidation } from './validations/CartValidation';
import PurchasesRecord from '@models/PurchasesRecord';
import { deliveryValidation } from './validations/DeliveryValidation';
import { paymentValidation } from './validations/PaymentValidation';
import { cancelPurchase, submitNewPurchase } from '../services/EmailService';
import User from '@models/User';

class PurchaseController {
  //ADMIN
  async indexAdmin(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 0;
    try {
      let purchases = await Purchase.find({store: String(store) })
        .skip(offset).limit(limit)
        .populate(['client', 'payment', 'delivery']);
        purchases = await Promise.all(purchases.map(async (purchase) => {
          purchase.cart = await Promise.all(purchase.cart.map(async (item) => {
            item.product = await Product.findById(item.product);
            item.variation= await Variation.findById(item.variation);
            return item;
          }));
          return purchase;
        }));
      return response.json({ purchases, offset, limit, total: purchases.length });
    } catch (error) {
      next(error);
    }
  }

  async showAdmin(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { id } = request.params;
    try {
      const purchase = await Purchase.findOne({ store: String(store), _id: id })
        .populate(['client', 'payment', 'delivery']);
        purchase.cart = await Promise.all(purchase.cart.map(async (item) => {
          item.product = await Product.findById(item.product);
          item.variation= await Variation.findById(item.variation);
          return item;
        }));
      const records = await PurchasesRecord.find({purchase: purchase._id})
      return response.json({purchase, records});
    } catch (error) {
      next(error);
    }
  }

  async removeAdmin(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { id } = request.params;
    try {
      const purchase = await Purchase.findOne({ store: String(store), _id: id })
        .populate({path: 'client', populate: 'user'});
      const client = await Client.findById(purchase.client);
      const user = await User.findById(client.user);
      if (!purchase) return response.status(400).json({Error: 'Purchase not found'});
      purchase.canceled = true;

      const purchasesRecord = new PurchasesRecord({
        purchase: purchase._id,
        type: 'purchase',
        status: 'purchase_canceled',
      })
      //Email
      cancelPurchase(user, purchase);
      await purchase.save();
      await purchasesRecord.save();
      return response.json({ canceled: true });
    } catch (error) {
      next(error);
    }
  }

  async showCartPurchaseAdmin(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { id } = request.params;
    try {
      const purchase = await Purchase.findOne({ store: String(store), _id: id })
      purchase.cart = await Promise.all(purchase.cart.map(async (item) => {
        item.product = await Product.findById(item.product);
        item.variation= await Variation.findById(item.variation);
        return item;
      }));

      return response.json({cart: purchase.cart});
    } catch (error) {
      next(error);
    }
  }
  //CLIENT
  async index(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 0;
    try {
      const client = await Client.findOne({user: request.payload.id});
      if (!client) return response.status(400).json({Error: 'Client not found'});
      let purchases = await Purchase.find({store: String(store), client: client._id })
      .skip(offset).limit(limit)
      .populate(['client', 'payment', 'delivery']);
      purchases = await Promise.all(purchases.map(async (purchase) => {
        purchase.cart = await Promise.all(purchase.cart.map(async (item) => {
          item.product = await Product.findById(item.product);
          item.variation= await Variation.findById(item.variation);
          return item;
        }));
        return purchase;
      }));
      return response.json({ purchases, offset, limit, total: purchases.length });
    } catch (error) {
      next(error);
    }
  }

  async show(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params;
    try {
      const client = await Client.findOne({user: request.payload.id});
      if (!client) return response.status(400).json({Error: 'Client not found'});
      const purchase = await Purchase.findOne({ client: client._id, _id: id })
        .populate(['client', 'payment', 'delivery']);
        purchase.cart = await Promise.all(purchase.cart.map(async (item) => {
          item.product = await Product.findById(item.product);
          item.variation= await Variation.findById(item.variation);
          return item;
        }));
      const records = await PurchasesRecord.find({purchase: purchase._id})
      return response.json({purchase, records});
    } catch (error) {
      next(error);
    }
  }
  

  async store(request: Request, response: Response , next: NextFunction) {
    const { cart, payment, delivery} = request.body;
    const { store } = request.query;
    try {
      if(!await CartValidation(cart)) return response.status(422).json({ error: 'Invalid cart' });
      const client = await Client.findOne({user: request.payload.id});
      if(!await deliveryValidation.checkValueAndDeadline(client.address.zipCode, cart, delivery)) return response.status(422).json({ error: 'Invalid data delivery' });
      const user = await User.findById(client.user)
      if(!await paymentValidation.checkTotalValue(cart, delivery, payment)) return response.status(422).json({ error: 'Invalid data payment' });
      if(!paymentValidation.checkCard(payment)) return response.status(422).json({ error: 'Invalid data with card payment' });
  
      const newPayment = new Payment({
        value: payment.value,
        type: payment.type,
        parcel: payment.parcel || 1,
        status: 'initiated',
        address: payment.address,
        card: payment.card || null,
        sameBillingAddress: payment.sameBillingAddress,
        store,
      });

      const newDelivery = new Delivery({
        status: 'not_started',
        cost: delivery.cost,
        deadline: delivery.deadline,
        type: delivery.type,
        address: delivery.address,
        store,
      });
      

      const purchase = new Purchase({
        client: client._id,
        cart,
        payment: newPayment._id,
        delivery: newDelivery._id,
        store,
        createdAt: new Date(),
      });

      newDelivery.purchase = purchase._id;
      newPayment.purchase = purchase._id;
      //notificar via e-mail - client e admin
      
      submitNewPurchase(user, purchase);
      const admins = await User.find({permission: 'admin', store: String(store) });
      admins.forEach((admin) => {
        submitNewPurchase(admin, purchase);
      })
      const purchasesRecord = new PurchasesRecord({
        purchase: purchase._id,
        type: 'purchase',
        status: 'purchase_created',
      })
      await purchase.save();
      await newDelivery.save();
      await newPayment.save();
      await purchasesRecord.save();
      response.json({
        purchase: purchase, delivery: newDelivery, payment: newPayment, client: client,
      });
    } catch (error) {
      
    }
  }
  
  async remove(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { id } = request.params;
    try {
      const client = await Client.findOne({user: request.payload.id});
      if (!client) return response.status(400).json({Error: 'Client not found'});
      const purchase = await Purchase.findOne({ client: client._id, _id: id })
      if (!purchase) return response.status(400).json({Error: 'Purchase not found'});
      purchase.canceled = true;
      // enviar email para admin 
      const admins = await User.find({permission: 'admin', store: String(store) });
      admins.forEach((admin) => {
        cancelPurchase(admin, purchase);
      })
      const purchasesRecord = new PurchasesRecord({
        purchase: purchase._id,
        type: 'purchase',
        status: 'purchase_canceled',
      })
      await purchase.save();
      await purchasesRecord.save();
      return response.json({ canceled: true });
    } catch (error) {
      next(error);
    }
  }

  async showCartPurchase(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params;
    try {
      const client = await Client.findOne({user: request.payload.id});
      if (!client) return response.status(400).json({Error: 'Client not found'});
      const purchase = await Purchase.findOne({ client: client._id, _id: id })
      purchase.cart = await Promise.all(purchase.cart.map(async (item) => {
        item.product = await Product.findById(item.product);
        item.variation= await Variation.findById(item.variation);
        return item;
      }));
      return response.json({ cart: purchase.cart });
    } catch (error) {
      next(error);
    }
  }

}

export { PurchaseController }
