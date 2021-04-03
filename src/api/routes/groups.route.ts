import { Router } from 'express';
import { create, findAll, update } from '../controllers/groups.controller';

const router = Router();

router.route('/:companyId([0-9]+)/groups/').get(findAll);
router.route('/:companyId([0-9]+)/groups/').post(create);

router.route('/:companyId([0-9]+)/groups/:groupId([0-9]+)').put(update);

export { router as groupsRoutes };
