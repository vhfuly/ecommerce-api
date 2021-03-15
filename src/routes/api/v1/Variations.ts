import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import {upload} from '../../../config/multer'
import { storeValidation } from '@validations/StoreValidation';
import { variationValidation } from '@validations/VariationValidation';
import { VariationController } from '@controllers/VariationController';

const variationController = new VariationController();

const router = Router();

router.get('/', variationController.index);
router.get('/:id', variationController.show);

router.post('/', auth.required, storeValidation.admin, variationController.store);
router.put('/:id', auth.required, storeValidation.admin, variationController.update);
router.put('/images/:id', auth.required, storeValidation.admin,upload.array('files', 4), variationController.updateImages);
router.delete('/:id', auth.required, storeValidation.admin, variationController.remove);

export { router as variationsRouter }