import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { storeValidation } from '@validations/StoreValidation';
import { clientValidation } from '@validations/ClientValidation';
import { DeliveryController } from '@controllers/DeliveryController';
const deliveryController = new DeliveryController();
const router = Router();

router.get('/:id', auth.required,deliveryController.show);
router.put('/:id', auth.required,deliveryController.update);
router.post('/:id', deliveryController.calculate);

export { router as deliveriesRouter }