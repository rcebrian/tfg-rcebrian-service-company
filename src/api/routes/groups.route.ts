import { Router } from 'express';
import {
  validatorHandler, auth, roleAdmin, roleMonitor,
} from '@rcebrian/tfg-rcebrian-common';
import {
  create, findAll, groupTree, remove, update, addUserToGroup,
} from '../controllers/groups.controller';
import { createNew, addUserToGroupValidation } from '../validations';

const router = Router();

router.route('/').get(auth, findAll); // deprecated
router.route('/').post(auth, roleAdmin, createNew(), validatorHandler, create); // ok

router.route('/:groupId([0-9]+)').get(auth, (roleAdmin || roleMonitor), groupTree); // ok
router.route('/:groupId([0-9]+)').put(auth, update); // deprecated
router.route('/:groupId([0-9]+)').delete(auth, remove); // deprecated

router.route('/:groupId([0-9]+)/users').put(auth, addUserToGroupValidation(), validatorHandler, addUserToGroup); // deprecated

export { router as groupsRoutes };
