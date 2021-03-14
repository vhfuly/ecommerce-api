import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { upload } from '@config/multer';
import { storeValidation } from '@validations/StoreValidation';
import { productValidation } from '@validations/ProductValidation';
import { ProductController } from '@controllers/ProductController';

const productController = new ProductController();

const router = Router();

// ADMIN
router.post("/", auth.required, storeValidation.admin,
  validate(productValidation.store), productController.store);
router.put("/:id", auth.required, storeValidation.admin,
  validate(productValidation.update), productController.update);
router.put("/images/:id", auth.required, storeValidation.admin, validate(productValidation.updateImages),
  upload.array("files", 4), productController.updateImages);
router.delete("/:id", auth.required, storeValidation.admin,
  validate(productValidation.remove), productController.remove);

// CLIENTS
router.get("/", validate(productValidation.index), productController.index);
router.get("/available", validate(productValidation.indexAvailable), productController.indexAvailable);
router.get("/search/:search", validate(productValidation.search), productController.search);
router.get("/:id", validate(productValidation.show), productController.show);

// VARIATIONS

// ASSESSMENTS

export { router as productsRouter }