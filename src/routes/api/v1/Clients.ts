import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { storeValidation } from '@validations/StoreValidation';
import { clientValidation } from '@validations/ClientValidation';
import { ClientController } from '@controllers/ClientController';
const clientController = new ClientController();
const router = Router();

//ADMIN
router.get('/', auth.required, storeValidation.admin, validate(clientValidation.index), clientController.index);
router.get('/search/:search/purchase', auth.required, storeValidation.admin, validate(clientValidation.searchPurchase), clientController.searchPurchase);
router.get('/search/:search', auth.required, storeValidation.admin, validate(clientValidation.search), clientController.search);
router.get('/admin/:id', auth.required, storeValidation.admin, validate(clientValidation.showAdmin), clientController.showAdmin);
router.get('/admin/:id/purchase', auth.required, storeValidation.admin,validate(clientValidation.showPurchaseAdmin), clientController.showPurchaseAdmin);

router.put('/admin/:id', auth.required, storeValidation.admin, validate(clientValidation.updateAdmin), clientController.updateAdmin);

//CLIENT
router.get('/:id', auth.required, validate(clientValidation.show), clientController.show);
router.post('/', validate(clientValidation.store), clientController.store);
router.put('/:id', auth.required, validate(clientValidation.update),clientController.update);
router.delete('/:id', auth.required, clientController.remove);

export { router as clientsRouter }