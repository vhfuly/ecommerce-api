import { Request, Response, NextFunction } from 'express';

import { createPayment, getNotification, getSessionId, getTransactionStatus} from './integrations/pagseguro';
import Payment from '@models/Payment';
import Product from '@models/Product';
import PurchasesRecord from '@models/PurchasesRecord';
import Purchase from '@models/Purchase';
import Variation from '@models/Variation';
import { Cart } from '@interfaces/Cart';
import { updatePurchase } from '../services/EmailService';
import Client from '@models/Client';
import User from '@models/User';

class PaymentController {
  async show(request: Request, response: Response , next: NextFunction) {
    const { id } = request.params;
    const { store } = request.query;
    try {
      const payment = await Payment.findOne({_id: id, store: String(store)});
      if (!payment) return response.status(400).json({error: 'Payment not found'});

      const record = await PurchasesRecord.find({ purchase: payment.purchase, type: 'payment'});

      const status: any = (payment.pagseguroCode) ? await getTransactionStatus(payment.pagseguroCode) : null;

      if ( 
        status &&
        ( 
          record.length === 0 ||
          !record[record.length-1].payload ||
          !record[record.length-1].payload.code ||
          record[record.length-1].payload.code !== status.code 
        )
      ){
        const purchasesRecord = new PurchasesRecord({
          purchase: payment.purchase,
          type: 'payment',
          status: status.status || "Status",
          payload: status,
        })

        payment.status = status.status;
        await payment.save();
        await purchasesRecord.save();
        record.push(purchasesRecord);
      }
      const purchase = await Purchase.findById(payment.purchase);
      const client = await Client.findById(purchase.client);
      const user = await User.findById(client.user);      
      updatePurchase(user, purchase, status, new Date(), 'payment')
      response.json({ payment, record, status });
    } catch (error) {
      next(error);
    }
  }

  async pay(request: Request, response: Response , next: NextFunction) {
    const { senderHash } = request.body;
    const { id } = request.params;
    const { store } = request.query;
    try {
      const payment = await Payment.findOne({_id: id, store: String(store)});
      if (!payment) return response.status(400).json({error: 'Payment not found'});

      const purchase: any = await Purchase.findById(payment.purchase).populate([
        { path: 'client', populate: 'user' },
        { path: 'delivery' },
        { path: 'payment' }
      ]);
      purchase.cart = await Promise.all(purchase.cart.map(async (item: Cart) => {
        item.product = await Product.findById(item.product);
        item.variation= await Variation.findById(item.variation);
        return item;
      }));
      const payload: any = await createPayment(senderHash, purchase)
      console.log(payload)
      payment.payload = (payment.payload) ? payment.payload.concat([payload]) : [payload];

      if (payload.code) payment.pagseguroCode = payload.code;

      await payment.save();

      response.json({ payment, payload });
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response , next: NextFunction) {
    const { status } = request.body;
    const { store } = request.query;
    const { id } = request.params;
    try {
      const payment = await Payment.findOne({_id: id, store: String(store)});
      if (!payment) return response.status(400).json({error: 'Payment not found'});

      if (status) payment.status = status;

      const purchasesRecord = new PurchasesRecord({
        purchase: payment.purchase,
        type: 'payment',
        status: status || "Status",
      })
      console.log(purchasesRecord)
      await purchasesRecord.save();
      //Enviar email de aviso pra o cliente
      const purchase = await Purchase.findById(payment.purchase);
      const client = await Client.findById(purchase.client);
      const user = await User.findById(client.user);      
      updatePurchase(user, purchase, status, new Date(), 'payment')
      await payment.save();
      response.json(payment);
    } catch (error) {
      next(error);
    }
  }

  async getSessionId(request: Request, response: Response , next: NextFunction) {
    try {
      const sessionId = await getSessionId();
      response.send({sessionId})
    } catch (error) {
      next(error)
    }
  }

  async notification(request: Request, response: Response , next: NextFunction) {
    const { notificationCode, notificationType } = request.body;
    try {
      if( notificationType !== "transaction" ) return response.send({ success: true });

      const result: any = await getNotification(notificationCode);

      const payment = await Payment.findOne({ pagseguroCode: result.code });
      if (!payment) return response.status(400).json({error: 'Payment not found'});

      const record = await PurchasesRecord.find({ purchase: payment.purchase, type: "payment" });

      const status: any = (payment.pagseguroCode) ? await getTransactionStatus(payment.pagseguroCode) : null;

      if( 
        status && 
          ( 
            record.length === 0 || 
            record[record.length-1].payload.code !== status.code 
          ) 
      ){
          const purchasesRecord = new PurchasesRecord({
              purchase: payment.purchase,
              type: "payment",
              status: status.status || "Status",
              payload: status
          });
          payment.status = status.status;
          await payment.save();
          
          await purchasesRecord.save();
          // Enviar email de aviso para o cliente - aviso de atualizacao de payment
      }
      response.json({ success: true });
    } catch (error) {
      next(error)
    }
  }
}

export { PaymentController }