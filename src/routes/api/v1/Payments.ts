import { Router, Request, Response } from 'express';
import { validate } from 'express-validation';


import { auth } from '../../auth';
import { storeValidation } from '@validations/StoreValidation';
import { PaymentController } from '@controllers/PaymentController';
const paymentController = new PaymentController();
const router = Router();

//teste tokens
if (process.env.NODE_ENV !== 'production') {
  router.get('/tokens', (request: Request, response: Response) => response.render('pagseguro/index'));
}

//pagseguro
router.post('/notification', paymentController.notification);
router.get('/session', paymentController.getSessionId);

//client
router.get('/:id', auth.required, paymentController.show);
router.post('/pay/:id', auth.required, paymentController.pay);

//ADMIN

router.put('/:id', auth.required, storeValidation.admin, paymentController.update);

export { router as paymentsRouter }