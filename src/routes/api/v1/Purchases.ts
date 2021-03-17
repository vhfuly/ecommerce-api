import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { storeValidation } from '@validations/StoreValidation';
import { PurchaseController } from '@controllers/PurchaseController';
const purchaseController = new PurchaseController();

const router = Router();


// ADMIN
router.get("/admin", auth.required, storeValidation.admin, purchaseController.indexAdmin);
router.get("/admin/:id", auth.required, storeValidation.admin, purchaseController.showAdmin);

router.delete("/admin/:id", auth.required, storeValidation.admin, purchaseController.removeAdmin);

// ADMIN -- cart
router.get("/admin/:id/cart", auth.required, storeValidation.admin, purchaseController.showCartPurchaseAdmin);

// CLIENT
router.get("/", auth.required, purchaseController.index);
router.get("/:id", auth.required, purchaseController.show);

router.post("/", auth.required, purchaseController.store);
router.delete("/:id", auth.required, purchaseController.remove);

//  CLIENT -- cart
router.get("/:id/cart", purchaseController.showCartPurchase);


export { router as purchasesRouter }