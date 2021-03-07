import { routerApi }  from './api/v1/index';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.use('/v1/api', routerApi)
router.get('/', (request: Request, response: Response , next: NextFunction) => response.send({ ok: true }));

export { router }