import { Router } from 'express';
import { usersRouter } from './Users';
import { storesRouter } from './Stores';
import { clientsRouter } from './Clients';
import { categoriesRouter } from './Categories';
import { productsRouter } from './Products';

const router = Router();

router.use('/users', usersRouter)
router.use('/stores', storesRouter)
router.use('/clients', clientsRouter)
router.use('/categories', categoriesRouter)
router.use('/products', productsRouter)

export { router as routerApi }