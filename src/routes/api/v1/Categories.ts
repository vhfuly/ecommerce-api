import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { CategoryController } from '@controllers/CategoryController';
import { storeValidation } from '@validations/StoreValidation';
import { categoryValidation } from '@validations/CategoryValidation';

const categoryController = new CategoryController();
const router = Router();

router.get('/', categoryController.index);
router.get('/available', categoryController.indexAvailable);
router.get('/:id', categoryController.show);

router.post('/', auth.required, storeValidation.admin, categoryController.store);
router.put('/', auth.required, storeValidation.admin, categoryController.update);
router.delete('/', auth.required, storeValidation.admin, categoryController.remove);

export { router as categoriesRouter }