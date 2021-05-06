import { Router } from 'express';
import { validatorHandler, auth } from '@rcebrian/tfg-rcebrian-common';
import {
  create, findAll, groupTree, remove, update, addUserToGroup,
} from '../controllers/groups.controller';
import { createNew, addUserToGroupValidation } from '../validations';

const router = Router();

router.route('/').get(auth, findAll);
router.route('/').post(createNew(), validatorHandler, create);

router.route('/:groupId([0-9]+)').get(groupTree);
router.route('/:groupId([0-9]+)').put(update);
router.route('/:groupId([0-9]+)').delete(remove);

router.route('/:groupId([0-9]+)/users').put(addUserToGroupValidation(), validatorHandler, addUserToGroup);

export { router as groupsRoutes };
