import { Router } from 'express';
import { create, findAll } from '../controllers/company.controller';

const router = Router();

router.route('/').post(create);
router.route('/').get(findAll);

export { router as companyRoutes };
