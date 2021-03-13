import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { upload } from '@config/multer';
import { storeValidation } from '@validations/StoreValidation';
import { clientValidation } from '@validations/ClientValidation';
import { ProductController } from '@controllers/ProductController';

const productController = new ProductController();

const router = Router();

// ADMIN
router.post("/", auth.required, storeValidation.admin, productController.store);
router.put("/:id", auth.required, storeValidation.admin, productController.update);
router.put("/images/:id", auth.required, storeValidation.admin, upload.array("files", 4), productController.updateImages);
router.delete("/:id", auth.required, storeValidation.admin, productController.remove);

// CLIENTS
router.get("/", productController.index);
router.get("/available", productController.indexAvailable);
router.get("/search/:search", productController.search);
router.get("/:id", productController.show);

// VARIATIONS

// ASSESSMENTS

export { router as productsRouter }