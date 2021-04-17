import { Router } from 'express';
import {
  create, findAll, findById, remove, update,
} from '../controllers/company.controller';
import { createNew, validator } from '../middlewares/validation.middleware';

const router = Router();

router.route('/').get(findAll);
router.route('/').post(createNew(), validator, create);

router.route('/:id([0-9]+)').get(findById);
router.route('/:id([0-9]+)').put(update);
router.route('/:id([0-9]+)').delete(remove);

export { router as companyRoutes };
