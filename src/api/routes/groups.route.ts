import { Router } from 'express';
import { findAll } from '../controllers/group.controller';

const router = Router();

router.route('/:companyId([0-9]+)/groups/').get(findAll);

export { router as groupsRoutes };
