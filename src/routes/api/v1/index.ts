import { Router } from 'express';
import { usersRouter } from './Users';
import { storesRouter } from './Stores';
import { clientsRouter } from './Clients';

const router = Router();

router.use('/users', usersRouter)
router.use('/stores', storesRouter)
router.use('/clients', clientsRouter)

export { router as routerApi }