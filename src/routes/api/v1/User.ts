import { Router } from 'express';

import auth from '../../auth';
import UserController from '../../../controller/UserController';

const userControle = new UserController();

const router = Router();

router.get('/', auth.require)
