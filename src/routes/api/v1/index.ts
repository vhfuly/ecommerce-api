import { Router } from 'express';
import { usersRouter } from './Users';

const router = Router();

router.use('/user', usersRouter)

export { router }