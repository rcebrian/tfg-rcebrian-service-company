import { Router } from 'express';
import { validatorHandler, auth, roleAdmin } from '@rcebrian/tfg-rcebrian-common';
import {
  create, findAll, groupTree, remove, update, addUserToGroup,
} from '../controllers/groups.controller';
import { createNew, addUserToGroupValidation } from '../validations';

const router = Router();

router.route('/').get(auth, findAll);
router.route('/').post(auth, roleAdmin, createNew(), validatorHandler, create); // ok

router.route('/:groupId([0-9]+)').get(auth, groupTree);
router.route('/:groupId([0-9]+)').put(auth, update);
router.route('/:groupId([0-9]+)').delete(auth, remove);

router.route('/:groupId([0-9]+)/users').put(auth, addUserToGroupValidation(), validatorHandler, addUserToGroup);

export { router as groupsRoutes };
