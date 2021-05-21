import { Router } from 'express';
import {
  validatorHandler, auth, roleAdmin,
} from '@rcebrian/tfg-rcebrian-common';
import {
  create, findAll, groupTree, remove, update, addUserToGroup,
} from '../controllers/groups.controller';
import { addUserToGroupValidation, createNewGroup } from '../validations';

const router = Router();

router.route('/').get(auth, findAll); // ok
router.route('/').post(auth, roleAdmin, createNewGroup(), validatorHandler, create); // ok

router.route('/:groupId([0-9]+)').get(auth, groupTree); // ok
router.route('/:groupId([0-9]+)').put(auth, update); // deprecated
router.route('/:groupId([0-9]+)').delete(auth, remove); // deprecated

router.route('/:groupId([0-9]+)/users').put(auth, addUserToGroupValidation(), validatorHandler, addUserToGroup); // deprecated

export { router as groupsRoutes };
