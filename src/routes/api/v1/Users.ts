import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../auth';
import { UserController } from '@controllers/UserController';
import { UserValidation } from '@validations/UserValidation';

const userController = new UserController();
const router = Router();

router.post('/login', validate(UserValidation.login), userController.login)
router.post('/register',validate(UserValidation.store), userController.store)
router.put('/', auth.required,validate(UserValidation.update), userController.update)
router.delete('/', auth.required, userController.remove)


router.get('/recover-password', userController.showRecovery);
router.post('/recover-password', userController.createRecovery);
router.get('/recovered-password', userController.showCompleteRecovery); 
router.post('/recovered-password', userController.completeRecovery);

router.get('/', auth.required, userController.index)
router.get('/:id', auth.required,validate(UserValidation.show), userController.show)

export { router as usersRouter }