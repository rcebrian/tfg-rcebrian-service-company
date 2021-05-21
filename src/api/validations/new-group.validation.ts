import { body } from 'express-validator';
import { Company } from '../repository/mysql/mysql.repository';

/**
 * Validate if the body params are valid
 * @returns array of validations
 */
export const createNewGroup = () => [
  body('name')
    .notEmpty().withMessage('Name field must be required'),
  body('description')
    .notEmpty().withMessage('Description field must be required'),
  body('companyId').notEmpty().withMessage('Company id must be required').isNumeric()
    .withMessage('Company id must be valid')
    .custom(async (value) => {
      if (value) {
        const exist = await Company.findOne({ where: { id: value } });
        return (exist === null)
          ? Promise.reject() : Promise.resolve();
      }
      return false;
    })
    .withMessage('Company not exist'),
];
