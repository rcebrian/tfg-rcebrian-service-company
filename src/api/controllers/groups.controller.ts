import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import { Group, UsersGroups } from '../repository/mysql/mysql.repository';

/**
 * Create a new group in a company
 * @param req POST method
 * @param res List of groups inside a company
 */
export const create = (req: Request, res: Response) => {
  const { companyId } = req.params;
  Group.create({
    name: req.body.name,
    description: req.body.description,
    companyId,
  }).then((data: any) => {
    res.status(httpStatus.CREATED)
      .json({ data });
  }).catch((err: ValidationError) => {
    res.status(httpStatus.BAD_REQUEST).json({ errors: err.message.split('\n') });
  });
};

/**
 * Get all groups from a company
 * @param req GET method
 * @param res List of groups inside a company
 */
export const findAll = (req: Request, res: Response) => {
  const { companyId } = req.params;
  Group.findAll({ where: { companyId } }).then((data: any) => {
    res.status(httpStatus.OK).json({ data });
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
  const { companyId, groupId } = req.params;

  const { userId } = req.body;

  UsersGroups.create({ userId, groupId })
    .then((data: any) => {
      res.status(httpStatus.CREATED).json({ data });
    });
};
