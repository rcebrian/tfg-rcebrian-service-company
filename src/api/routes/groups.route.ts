import { Router } from 'express';
import { validatorHandler } from '@rcebrian/tfg-rcebrian-common';
import {
  create, findAll, findById, remove, update, addUserToGroup,
} from '../controllers/groups.controller';
import { createNew, addUserToGroupValidation } from '../validations';

const router = Router();

router.route('/:companyId([0-9]+)/groups/').get(findAll);
router.route('/:companyId([0-9]+)/groups/').post(createNew(), validatorHandler, create);

router.route('/:companyId([0-9]+)/groups/:groupId([0-9]+)').get(findById);
router.route('/:companyId([0-9]+)/groups/:groupId([0-9]+)').put(update);
router.route('/:companyId([0-9]+)/groups/:groupId([0-9]+)').delete(remove);

router.route('/:companyId([0-9]+)/groups/:groupId([0-9]+)/users').put(addUserToGroupValidation(), validatorHandler, addUserToGroup);

export { router as groupsRoutes };
