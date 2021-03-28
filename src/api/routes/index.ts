import { Router } from 'express';
import { companyRoutes } from './company.route';

const router = Router();

router.use('/company', companyRoutes);

export default router;
