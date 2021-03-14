import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { AssessmentController } from '@controllers/AssessmentController';
import { assessmentValidation } from '@validations/AssessmentValidation';
import { storeValidation } from '@validations/StoreValidation';


const assessmentsController = new AssessmentController();
const router = Router();

//client
router.get('/', validate(assessmentValidation.index), assessmentsController.index);
router.get('/:id',validate(assessmentValidation.show), assessmentsController.show);
router.post('/',validate(assessmentValidation.store), auth.required, assessmentsController.store);

//ADMIN
router.delete('/', auth.required,storeValidation.admin,
  validate(assessmentValidation.remove), assessmentsController.remove);


export { router as assessmentsRouter }