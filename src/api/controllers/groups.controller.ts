import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Group } from '../repository/mysql/mysql.repository';

export const findAll = (req: Request, res: Response) => {
  const { companyId } = req.params;
  Group.findAll({ where: { companyId } }).then((data) => {
    res.status(httpStatus.OK).json({ data });
  }).catch((err) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err });
  });
};
