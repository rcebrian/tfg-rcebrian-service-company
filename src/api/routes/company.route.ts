import { Router } from 'express';
import {
  create, findAll, findById, remove,
} from '../controllers/company.controller';

const router = Router();

router.route('/').post(create);
router.route('/').get(findAll);
router.route('/:id([0-9]+)').get(findById);
router.route('/:id([0-9]+)').delete(remove);

export { router as companyRoutes };
