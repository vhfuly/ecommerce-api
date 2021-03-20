import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { storeValidation } from '@validations/StoreValidation';
import { deliveryValidation } from '@validations/DeliveryValidation';
import { DeliveryController } from '@controllers/DeliveryController';
const deliveryController = new DeliveryController();
const router = Router();

router.get('/:id', auth.required, validate(deliveryValidation.show), deliveryController.show);
router.put('/:id', auth.required, storeValidation.admin, validate(deliveryValidation.update), deliveryController.update);
router.post('/calculate', validate(deliveryValidation.calculate), deliveryController.calculate);

export { router as deliveriesRouter }