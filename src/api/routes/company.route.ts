import { Router } from 'express';
import { auth, roleAdmin, validatorHandler } from '@rcebrian/tfg-rcebrian-common';
import {
  create, findAll, findById, remove, update, findAllCompanyTree, findByIdCompanyTree,
} from '../controllers/company.controller';

import { createNew } from '../validations';

const router = Router();

router.route('/').get(auth, roleAdmin, findAll);
router.route('/tree').get(auth, roleAdmin, findAllCompanyTree);
router.route('/').post(auth, roleAdmin, createNew(), validatorHandler, create);

router.route('/:companyId([0-9]+)/tree').get(auth, roleAdmin, findByIdCompanyTree);
// router.route('/:id([0-9]+)').get(auth, roleAdmin, findById); // deprecated
router.route('/:id([0-9]+)').put(auth, roleAdmin, createNew(), validatorHandler, update);
router.route('/:id([0-9]+)').delete(auth, roleAdmin, remove);

export { router as companyRoutes };
