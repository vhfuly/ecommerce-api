import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { CategoryController } from '@controllers/CategoryController';
import { storeValidation } from '@validations/StoreValidation';
import { categoryValidation } from '@validations/CategoryValidation';

const categoryController = new CategoryController();
const router = Router();

router.get('/', validate(categoryValidation.index), categoryController.index);
router.get('/available', validate(categoryValidation.indexAvailable), categoryController.indexAvailable);
router.get('/:id', validate(categoryValidation.show), categoryController.show);

router.post('/', auth.required, storeValidation.admin, validate(categoryValidation.store), categoryController.store);
router.put('/:id', auth.required, storeValidation.admin, validate(categoryValidation.update), categoryController.update);
router.delete('/:id', auth.required, storeValidation.admin, validate(categoryValidation.remove), categoryController.remove);

export { router as categoriesRouter }