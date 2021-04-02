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
  }).catch((err) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err });
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
    }).catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: err });
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
  }).catch((err) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ err: err.message });
  });
};

/**
 * Get a company from database filtered by id
 * @param req GET method with company id as path param
 * @param res one company or empty
 */
export const remove = (req: Request, res: Response) => {
  const { id } = req.params;

  Company.destroy({ where: { id } }).then((data) => {
    res.status(httpStatus.NO_CONTENT)
      .json({ data });
  }).catch((err) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ err: err.message });
  });
};
