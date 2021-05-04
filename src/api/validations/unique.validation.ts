import { User, UsersGroups } from '@rcebrian/tfg-rcebrian-domain';
import { body } from 'express-validator';

/**
 * Validate if the body params are valid
 * @returns array of validations
 */
export const addUserToGroupValidation = () => [
  body('userId')
    .notEmpty().withMessage('userId field must be required')
    .isNumeric()
    .withMessage('userId must be numeric')
    .custom(async (value) => {
      const user = await User.findOne({ where: { id: value } });
      return (user !== null)
        ? Promise.resolve() : Promise.reject();
    })
    .withMessage('User need to exist')
    .custom(async (value, req) => {
      const { groupId }: any = req.req.params;
      const exists = await UsersGroups.findOne({ where: { userId: value, groupId } });
      return (exists === null)
        ? Promise.resolve() : Promise.reject();
    })
    .withMessage('User already inside group'),
];
