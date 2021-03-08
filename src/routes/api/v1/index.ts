import { Router } from 'express';
import { usersRouter } from './Users';
import { storesRouter } from './Store';

const router = Router();

router.use('/users', usersRouter)
router.use('/stores', storesRouter)

export { router as routerApi }