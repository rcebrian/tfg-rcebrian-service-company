import { body } from 'express-validator';

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
