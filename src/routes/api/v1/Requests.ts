import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { storeValidation } from '@validations/StoreValidation';
import { RequestController } from '@controllers/RequestController';
const requestController = new RequestController();

const router = Router();


// ADMIN
router.get("/admin", auth.required, storeValidation.admin, requestController.indexAdmin);
router.get("/admin/:id", auth.required, storeValidation.admin, requestController.showAdmin);

router.delete("/admin/:id", auth.required, storeValidation.admin, requestController.removeAdmin);

// ADMIN -- cart
router.get("/admin/:id/cart", auth.required, storeValidation.admin, requestController.showCartRequestAdmin);

// CLIENT
router.get("/", auth.required, requestController.index);
router.get("/:id", auth.required, requestController.show);

router.post("/", auth.required, requestController.store);
router.delete("/:id", auth.required, requestController.remove);

//  CLIENT -- cart
router.get("/:id/cart", requestController.showCartRequest);


export { router as requestsRouter }