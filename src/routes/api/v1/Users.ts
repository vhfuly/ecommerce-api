import { Router } from 'express';

import { auth } from '../../auth';
import UserController from '../../../controller/UserController';

const userController = new UserController();

const router = Router();

router.get('/', auth.required, userController.index)
router.get('/:id', auth.required, userController.show)
router.post('/login', userController.login)
router.post('/register', userController.store)
router.put('/', auth.required, userController.update)
router.delete('/', auth.required, userController.remove)


router.get('/recover-password', userController.showRecovery);
router.post('/recover-password', userController.createRecovery);
router.get('/recover-password', userController.showCompleteRecovery); 
router.post('/recover-password', userController.completeRecovery);


export { router as usersRouter }