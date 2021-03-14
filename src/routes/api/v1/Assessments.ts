import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { AssessmentController } from '@controllers/AssessmentController';

import { storeValidation } from '@validations/StoreValidation';


const assessmentsController = new AssessmentController();
const router = Router();

//client
router.get('/', assessmentsController.index);
router.get('/:id', assessmentsController.show);
router.post('/', auth.required, assessmentsController.store);

//ADMIN
router.delete('/', auth.required,storeValidation.admin, assessmentsController.remove);


export { router as assessmentsRouter }