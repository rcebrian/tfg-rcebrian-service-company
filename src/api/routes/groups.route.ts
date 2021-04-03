import { Router } from 'express';
import { create, findAll } from '../controllers/groups.controller';

const router = Router();

router.route('/:companyId([0-9]+)/groups/').get(findAll);
router.route('/:companyId([0-9]+)/groups/').post(create);

export { router as groupsRoutes };
