import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import { Company } from '../repository/mysql/mysql.repository';

export const create = (req: Request, res: Response) => {
  Company.create({
    name: req.body.name,
    description: req.body.description,
  }).then((data) => {
    res.status(httpStatus.CREATED)
      .json({ data });
  }).catch((err: ValidationError) => {
    res.status(httpStatus.BAD_REQUEST).json({ errors: err.message.split('\n') });
  });
};

/**
 * Get all companies from database
 * @param req GET method
 * @param res List of companies
 */
export const findAll = (req: Request, res: Response) => {
  Company.findAll()
    .then((data) => {
      res.status(httpStatus.OK).json({ data });
    });
};

/**
 * Get a company from database filtered by id
 * @param req GET method with company id as path param
 * @param res one company or empty
 */
export const findById = (req: Request, res: Response) => {
  const { id } = req.params;

  Company.findOne({ where: { id } }).then((data) => {
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
  const { id } = req.params;
  const company = req.body;
  Company.update(
    {
      name: company.name,
      description: company.description,
    },
    { where: { id } },
  ).then(() => {
    res.status(httpStatus.ACCEPTED)
      .json();
  });
};

/**
 * Delete a company from database filtered by id
 * @param req DELETE method with company id as path param
 * @param res NO CONTENT
 */
export const remove = (req: Request, res: Response) => {
  const { id } = req.params;

  Company.destroy({ where: { id } }).then((data) => {
    res.status(httpStatus.NO_CONTENT)
      .json({ data });
  });
};
