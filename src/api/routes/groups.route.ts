import { Router } from 'express';
import { validatorHandler } from '@rcebrian/tfg-rcebrian-common';
import {
  create, findAll, findById, remove, update,
} from '../controllers/groups.controller';
import { createNew } from '../validations';

const router = Router();

router.route('/:companyId([0-9]+)/groups/').get(findAll);
router.route('/:companyId([0-9]+)/groups/').post(createNew(), validatorHandler, create);

router.route('/:companyId([0-9]+)/groups/:groupId([0-9]+)').get(findById);
router.route('/:companyId([0-9]+)/groups/:groupId([0-9]+)').put(update);
router.route('/:companyId([0-9]+)/groups/:groupId([0-9]+)').delete(remove);

export { router as groupsRoutes };
