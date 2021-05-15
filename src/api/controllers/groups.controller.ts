import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Group, User, UsersGroups } from '../repository/mysql/mysql.repository';

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
    res.status(httpStatus.CREATED)
      .json({ data });
  }).catch((err) => next(err));
};

/**
 * Get all groups from a company
 * @param req GET method
 * @param res List of groups inside a company
 */
export const findAll = async (req: Request, res: Response) => {
  const token: any = req.headers.authorization?.replace('Bearer ', '');

  const decoded = jwt.decode(token, { complete: true });

  const payload: any = decoded?.payload;

  const groups: any = await User.findOne(
    {
      where: { id: payload?.id },
      include: [Group],
    },
  );

  res.status(httpStatus.OK).json({ data: groups });
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
 * @param res
 */
export const groupTree = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  const group = await Group.findOne({
    where: {
      id: groupId,
    },
    include: User,
  });

  const result = (group) ? groupToTreeNode(group.toJSON()) : {};

  res.status(httpStatus.OK).json(result);
};
