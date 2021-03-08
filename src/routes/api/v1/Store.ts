import { Router } from 'express';

import { storeValidation } from '../../../controllers/validations/storeValidation';
import { auth } from '../../auth';
import { StoreController } from '../../../controllers/UserController';

const storeController = new StoreController();

const router = Router();

router.get('/', storeController.index);
router.get('/:id', storeController.show);

router.post('/', auth.required, storeValidation, storeController.store);
router.put('/:id', auth.required, storeValidation, storeController.update);
router.delete('/:id', auth.required, storeValidation, storeController.remove);

export { router as storesRouter }
