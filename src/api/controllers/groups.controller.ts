import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Group } from '../repository/mysql/mysql.repository';

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
