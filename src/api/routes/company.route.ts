import { Router } from 'express';
import { create } from '../controllers/company.controller';

const router = Router();

router.route('/').post(create);

export { router as companyRoutes };
