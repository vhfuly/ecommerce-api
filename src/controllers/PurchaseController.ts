import { Request, Response, NextFunction } from 'express';

import Purchase from '@models/Purchase';
import User from '@models/User';
import Client from '@models/Client';
import Product from '@models/Product';
import Delivery from '@models/Delivery';
import Payment from '@models/Payment';
import Variation from '@models/Variation';

class PurchaseController {
  //ADMIN
  async indexAdmin(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 0;
    try {
      const purchases = await Purchase.find({store: String(store) })
        .skip(offset).limit(limit)
        .populate(['client', 'payment', 'delivery', 'variation', 'product']);
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
        .populate(['client', 'payment', 'delivery', 'variation', 'product']);
      return response.json(purchase);
    } catch (error) {
      next(error);
    }
  }

  async removeAdmin(request: Request, response: Response , next: NextFunction) {
    const { store } = request.query;
    const { id } = request.params;
    try {
      const purchase = await Purchase.findOne({ store: String(store), _id: id })
      if (!purchase) return response.status(400).json({Error: 'Purchase not found'});
      purchase.canceled = true;

      //registro de atividade = pedido cancelado
      // enviar email para cliente e admin

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
      return response.json({ cart: purchase.cart });
    } catch (error) {
      next(error);
    }
  }
}

export { PurchaseController }
