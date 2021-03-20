import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { storeValidation } from '@validations/StoreValidation';
import { purchaseValidation } from '@validations/PurchaseValidation';
import { PurchaseController } from '@controllers/PurchaseController';
const purchaseController = new PurchaseController();

const router = Router();


// ADMIN
router.get("/admin", auth.required, storeValidation.admin, validate(purchaseValidation.indexAdmin), purchaseController.indexAdmin);
router.get("/admin/:id", auth.required, storeValidation.admin, validate(purchaseValidation.showAdmin), purchaseController.showAdmin);

router.delete("/admin/:id", auth.required, storeValidation.admin, validate(purchaseValidation.removeAdmin), purchaseController.removeAdmin);

// ADMIN -- cart
router.get("/admin/:id/cart", auth.required, storeValidation.admin, validate(purchaseValidation.showCartPurchaseAdmin), purchaseController.showCartPurchaseAdmin);

// CLIENT
router.get("/", auth.required, validate(purchaseValidation.index), purchaseController.index);
router.get("/:id", auth.required, validate(purchaseValidation.show), purchaseController.show);

router.post("/", auth.required, validate(purchaseValidation.store), purchaseController.store);
router.delete("/:id", auth.required, validate(purchaseValidation.remove), purchaseController.remove);

//  CLIENT -- cart
router.get("/:id/cart", validate(purchaseValidation.showCartPurchase), purchaseController.showCartPurchase);


export { router as purchasesRouter }