import { Router } from 'express';
import { create, findAll, findById } from '../controllers/company.controller';

const router = Router();

router.route('/').post(create);
router.route('/').get(findAll);
router.route('/:id([0-9]+)').get(findById);

export { router as companyRoutes };
