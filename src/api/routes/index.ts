import { Router } from 'express';
import { companyRoutes } from './company.route';
import { groupsRoutes } from './groups.route';

const router = Router();

router.use('/company', companyRoutes);
router.use('/company/groups', groupsRoutes);

export default router;
