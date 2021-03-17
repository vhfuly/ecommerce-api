import { Router } from 'express';
import { usersRouter } from './Users';
import { storesRouter } from './Stores';
import { clientsRouter } from './Clients';
import { categoriesRouter } from './Categories';
import { productsRouter } from './Products';
import { assessmentsRouter } from './Assessments';
import { variationsRouter } from './Variations';
import { purchasesRouter } from './Purchases';

const router = Router();

router.use('/users', usersRouter)
router.use('/stores', storesRouter)
router.use('/clients', clientsRouter)
router.use('/categories', categoriesRouter)
router.use('/products', productsRouter)
router.use('/assessments', assessmentsRouter)
router.use('/variations', variationsRouter)
router.use('/purchases', purchasesRouter)

export { router as routerApi }