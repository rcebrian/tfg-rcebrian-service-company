import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import { Company } from '../repository/mysql/mysql.repository';

export const create = (req: Request, res: Response) => {
  Company.create({
    name: req.body.name,
    description: req.body.description,
  }).then((company) => {
    const data = {
      company,
      _links: {
        self: {
          href: `${req.protocol}://${req.get('host')}/api/company/${company.id}`,
        },
      },
    };
    res.status(httpStatus.CREATED)
      .json(data);
  }).catch((err: ValidationError) => {
    res.status(httpStatus.BAD_REQUEST).json({ errors: err.message.split('\n') });
  }).catch((err) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err });
  });
};
