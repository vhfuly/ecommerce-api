import { Request, Response, NextFunction } from 'express';

import Delivery from '@models/Delivery';
import PurchasesRecord from '@models/PurchasesRecord';
import { Cart } from '@interfaces/Cart';
import Product, { ProductDocument } from '@models/Product';
import Variation, { VariationDocument } from '@models/Variation';
import { calculateShipping } from './integrations/correios';
import { updatePurchase } from '../services/EmailService';
import Client from '@models/Client';
import Purchase from '@models/Purchase';
import User from '@models/User';

interface CartCorreios {
  variation: VariationDocument;
  product: ProductDocument;
  staticProduct: string;
  amount: number;
  unitPrice: number;
}

class DeliveryController {
  async show(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params;
    const { store } = request.query;
    try {
      const delivery = await Delivery.findOne({ _id: id , store: String(store) });
      const records = await PurchasesRecord.find({ purchase: delivery.purchase, type: 'delivery'});
      response.json({delivery, records })
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params;
    const { status, trackingCode } = request.body;
    const { store } = request.query;
    try {
      const delivery = await Delivery.findOne({ _id: id , store: String(store) });

      if (status) delivery.status = status;
      if (trackingCode) delivery.trackingCode = trackingCode;
      // enviar email de aviso
      const purchase = await Purchase.findById(delivery.purchase);
      const client = await Client.findById(purchase.client);
      const user = await User.findById(client.user);      
      updatePurchase(user, purchase, status, new Date(), 'delivery')
      const record = new PurchasesRecord({
        purchase: delivery.purchase,
        type: 'delivery',
        status,
        payload: request.body,
      })
      await record.save();
      await delivery.save();
      response.json(delivery);
    } catch (error) {
      next(error)
    }
  }

  async calculate(request: Request, response: Response , next: NextFunction) {
    const { zipCode, cart } = request.body;
    try {
      const cartCorreios: CartCorreios[] = await Promise.all(cart.map(async (item: Cart) => {
        item.product = await Product.findById(item.product);
        item.variation= await Variation.findById(item.variation);
        return item;
      }));
      const results = await calculateShipping(zipCode, cartCorreios)
      response.json(results);
    } catch (error) {
      next(error)
    }
  }
}

export { DeliveryController }