import { Router } from 'express';
import { roleAdmin, roleCompany, validatorHandler } from '@rcebrian/tfg-rcebrian-common';
import {
  create, findAll, findById, remove, update,
} from '../controllers/company.controller';

import { createNew } from '../validations';

const router = Router();

router.route('/').get(roleAdmin, findAll);
router.route('/').post(roleAdmin, createNew(), validatorHandler, create);

router.route('/:id([0-9]+)').get(roleAdmin, roleCompany, findById);
router.route('/:id([0-9]+)').put(roleAdmin, createNew(), validatorHandler, update);
router.route('/:id([0-9]+)').delete(roleAdmin, createNew(), validatorHandler, remove);

export { router as companyRoutes };
