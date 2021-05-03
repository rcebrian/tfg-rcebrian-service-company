import { Router } from 'express';
import { roleAdmin, validatorHandler } from '@rcebrian/tfg-rcebrian-common';
import {
  create, findAll, findById, remove, update,
} from '../controllers/company.controller';

import { createNew } from '../validations';

const router = Router();

router.route('/').get(roleAdmin, findAll);
router.route('/').post(createNew(), validatorHandler, create);

router.route('/:id([0-9]+)').get(findById);
router.route('/:id([0-9]+)').put(update);
router.route('/:id([0-9]+)').delete(remove);

export { router as companyRoutes };
