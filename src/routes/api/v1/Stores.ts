import { Router } from 'express';
import { validate } from 'express-validation';

import { storeValidation } from '@validations/StoreValidation';
import { auth } from '../../auth';
import { StoreController } from '@controllers/StoreController';

const storeController = new StoreController();

const router = Router();

router.get('/', storeController.index);
router.get('/:id', validate(storeValidation.show), storeController.show);

router.post('/', auth.required,validate(storeValidation.store), storeController.store);
router.put('/:id', auth.required, storeValidation.admin,validate(storeValidation.update), storeController.update);
router.delete('/:id', auth.required, storeValidation.admin, storeController.remove);

export { router as storesRouter }
