import { body, param } from 'express-validator';
import { Group, User, UsersGroups } from '../repository/mysql/mysql.repository';

/**
 * Validate if the body params are valid
 * @returns array of validations
 */
export const addUserToGroupValidation = () => [
  param('groupId')
    .custom(async (value, req) => {
      const { companyId }: any = req.req.params;
      const group = await Group.findOne({ where: { id: value, companyId } });
      return (group !== null)
        ? Promise.resolve() : Promise.reject();
    }).withMessage('Group not exist'),
  body('userId')
    .notEmpty().withMessage('userId field must be required')
    .isNumeric()
    .withMessage('userId must be numeric')
    .custom(async (value) => {
      const user = await User.findOne({ where: { id: value } });
      return (user !== null)
        ? Promise.resolve() : Promise.reject();
    })
    .withMessage('User not exist')
    .custom(async (value, req) => {
      const { groupId }: any = req.req.params;
      const exists = await UsersGroups.findOne({ where: { userId: value, groupId } });
      return (exists === null)
        ? Promise.resolve() : Promise.reject();
    })
    .withMessage('User already inside group'),
];
