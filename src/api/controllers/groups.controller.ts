import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import { Group } from '../repository/mysql/mysql.repository';

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
  }).then((data) => {
    res.status(httpStatus.CREATED)
      .json({ data });
  }).catch((err: ValidationError) => {
    res.status(httpStatus.BAD_REQUEST).json({ errors: err.message.split('\n') });
  }).catch((err) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err });
  });
};

/**
 * Get all groups from a company
 * @param req GET method
 * @param res List of groups inside a company
 */
export const findAll = (req: Request, res: Response) => {
  const { companyId } = req.params;
  Group.findAll({ where: { companyId } }).then((data) => {
    res.status(httpStatus.OK).json({ data });
  }).catch((err) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err });
  });
};
