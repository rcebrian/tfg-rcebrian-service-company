import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import { roleAdmin, validatorHandler } from '@rcebrian/tfg-rcebrian-common';
import {
  create, findAll, findById, remove, update,
} from '../controllers/company.controller';

import { createNew } from '../validations';

const router = Router();

router.route('/admin').get(roleAdmin, (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({ message: 'Access granted' });
});
router.route('/').get(findAll);
router.route('/').post(createNew(), validatorHandler, create);

router.route('/:id([0-9]+)').get(findById);
router.route('/:id([0-9]+)').put(update);
router.route('/:id([0-9]+)').delete(remove);

export { router as companyRoutes };
