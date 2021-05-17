import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { TokenPropertiesEnum, getPropertyFromBearerToken, APIError } from '@rcebrian/tfg-rcebrian-common';
import { Group, User, UsersGroups } from '../repository/mysql/mysql.repository';
import logger from '../../config/winston.config';

/**
 * Create a new group in a company
 * @param req POST method
 * @param res List of groups inside a company
 */
export const create = (req: Request, res: Response, next: NextFunction) => {
  Group.create({
    name: req.body.name,
    description: req.body.description,
    companyId: req.body.companyId,
  }).then((data: any) => {
    res.status(httpStatus.CREATED).json({ data });
  }).catch((err: any) => {
    logger.error(err.stack);
    next(err);
  });
};

/**
 * Get all groups from a company
 * @param req GET method
 * @param res List of groups inside a company
 */
export const findAll = (req: Request, res: Response, next: NextFunction) => {
  const userId = getPropertyFromBearerToken(req.headers, TokenPropertiesEnum.ID);

  User.findOne({
    where: { id: userId },
    include: [Group],
  }).then((data) => {
    res.status(httpStatus.OK).json({ data });
  }).catch((err) => {
    logger.error(err.stack);
    next(err);
  });
};

/**
 * Get a group from database filtered by id in a company
 * @param req GET method with company id as path param
 * @param res one group or empty
 */
export const findById = (req: Request, res: Response) => {
  const { companyId, groupId } = req.params;

  Group.findOne({ where: { companyId, id: groupId } }).then((data: any) => {
    res.status(httpStatus.OK)
      .json({ data });
  });
};

/**
 * Update a company from database filtered by id
 * @param req PUT method with company id as path param
 * @param res ACCEPTED company with new attributes
 */
export const update = (req: Request, res: Response) => {
  const { companyId, groupId } = req.params;
  const group = req.body;
  Group.update(
    {
      name: group.name,
      description: group.description,
    },
    { where: { companyId, id: groupId } },
  ).then(() => {
    res.status(httpStatus.ACCEPTED)
      .json();
  });
};

/**
 * Delete a group from database filtered by id in a company
 * @param req DELETE method with company and group id as path param
 * @param res NO CONTENT
 */
export const remove = (req: Request, res: Response) => {
  const { companyId, groupId } = req.params;

  Group.destroy({ where: { companyId, id: groupId } }).then((data: any) => {
    res.status(httpStatus.NO_CONTENT)
      .json({ data });
  });
};

/**
 * Add a user to an existing group
 * @param req PUT valid user
 * @param res CREATED
 */
export const addUserToGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  const { userId } = req.body;

  UsersGroups.create({ userId, groupId })
    .then((data: any) => {
      res.status(httpStatus.CREATED).json({ data });
    });
};

/**
 * Generate a TreeNode object from a group
 * @param group with users
 * @returns group as a TreeNode
 */
const groupToTreeNode = (group: any) => ((group) ? [{
  data: {
    id: group.id,
    kind: 'group',
    name: group.name,
    description: group.description,
    size: group.users.length,
  },
  children: group.users.map((item: any) => ({
    data: {
      id: item.id,
      name: `${item.firstName} ${item.lastName}`,
      description: item.email,
      kind: item.role.name.replace('ROLE_', ''),
    },
  })),
  expanded: (group.users.length) > 0,
}] : [{}]);

/**
 * Return the info of a group as a TreeNode
 * @param req GET :groupId
 * @param res 200 - OK
 * @param next request
 */
export const groupTree = (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.params;

  Group.findOne({
    where: {
      id: groupId,
    },
    order: [['createdAt', 'ASC']],
    include: User,
  }).then((data) => {
    if (!data) {
      throw new APIError({
        message: 'Not found',
        status: httpStatus.NOT_FOUND,
        stack: `Can't find group. Group [${groupId}] not exists`,
      });
    }

    const result = (data) ? groupToTreeNode(data.toJSON()) : {};

    res.status(httpStatus.OK).json(result);
  }).catch((err) => {
    logger.error(err.stack);
    next(err);
  });
};
