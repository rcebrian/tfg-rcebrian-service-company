import { Router } from 'express';
import { findAll } from '../controllers/company.controller';

const router = Router();

router.route('/').get(findAll);

export { router as companyRoutes };
