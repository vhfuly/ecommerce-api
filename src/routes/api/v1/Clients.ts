import { Router } from 'express';

import { auth } from '../../auth';
import { storeValidation } from '@validations/StoreValidation';
// import { clientValidation } from '@validations/ClientValidation';
import { ClientController } from '@controllers/ClientController';

const clientController = new ClientController();
const router = Router();

//ADMIN
router.get('/', auth.required, storeValidation.admin, clientController.index);
router.get('/search/:search/purchase', auth.required, storeValidation.admin, clientController.searchPurchase);
router.get('/search/:search', auth.required, storeValidation.admin, clientController.search);
router.get('/admin/:id', auth.required, storeValidation.admin, clientController.showAdmin);
router.get('/admin/:id/purchase', auth.required, storeValidation.admin, clientController.showPurchaseAdmin);

router.put('/admin/:id', auth.required, storeValidation.admin, clientController.updateAdmin);

//CLIENT
// router.get('/:id', auth.required, clientController.show);
// router.post('/', clientController.store);
// router.put('/:id', auth.required, clientController.update);
// router.delete('/:id', auth.required, clientController.remove);

export { router as clientsRouter }