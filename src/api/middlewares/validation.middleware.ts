import { body, validationResult } from 'express-validator';
import {
  Request, Response, NextFunction,
} from 'express';
import httpStatus from 'http-status';
import { APIError } from '../utils/errors';

/**
 * Validate if the body params are valid
 * @returns array of validations
 */
export const createNew = () => [
  body('name')
    .notEmpty().withMessage('Name field must be required')
    .matches(/^[A-Za-z ]+$/)
    .withMessage('Name must be valid'),
  body('description')
    .notEmpty().withMessage('Description field must be required')
    .matches(/^[A-Za-z ]+$/)
    .withMessage('Description must be valid'),
];

/**
 * Validate the input in requests
 * @param req request with input form
 * @param res response
 * @param next next call
 * @returns
 */
export const validator = (req: Request, res: Response, next: NextFunction) => {
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    return next();
  }
  const errors: any = [];
  validationErrors.array().forEach((err) => errors.push(err.msg));
  throw new APIError({ message: 'Bad request', errors, status: httpStatus.BAD_REQUEST });
};
