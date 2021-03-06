import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { APIError } from '@rcebrian/tfg-rcebrian-common';
import { Company, Group } from '../repository/mysql/mysql.repository';
import logger from '../../config/winston.config';

/**
 * Create a new company in database
 * @param req company data
 * @param res 201 - Created
 * @param next request
 */
export const create = (req: Request, res: Response, next: NextFunction) => {
  Company.create({
    name: req.body.name,
    description: req.body.description,
  }).then((data: any) => {
    res.status(httpStatus.CREATED).json({ data });
  }).catch((err: any) => {
    logger.error(err.stack);
    next(err);
  });
};

/**
 * Get all companies from database
 * @param req GET method
 * @param res List of companies
 * @param next request
 */
export const findAll = (req: Request, res: Response, next: NextFunction) => {
  Company.findAll(
  ).then((data: any) => {
    res.status(httpStatus.OK).json({ data });
  }).catch((err: any) => {
    logger.error(err.stack);
    next(err);
  });
};

/**
 * Get a company from database filtered by id
 * @param req GET method with company id as path param
 * @param res one company or empty
 */
export const findById = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  Company.findOne({ where: { id } }).then((data: any) => {
    res.status(httpStatus.OK)
      .json({ data });
  });
};

/**
 * Update a company from database filtered by id
 * @param req PUT method with company id as path param
 * @param res ACCEPTED company with new attributes
 */
export const update = (req: Request, res: Response, next: NextFunction) => {
  const { companyId } = req.params;
  const company = req.body;

  Company.findOne(
    { where: { id: companyId } },
  ).then((user) => {
    if (!user) {
      throw new APIError({
        message: 'Not found',
        status: httpStatus.NOT_FOUND,
        stack: `Can't delete company. Company [${companyId}] not exists`,
      });
    }
    Company.update(
      {
        name: company.name,
        description: company.description,
      },
      { where: { id: companyId } },
    ).then(() => {
      res.status(httpStatus.ACCEPTED).json();
    }).catch((err: any) => {
      logger.error(err.stack);
      next(err);
    });
  }).catch((err) => {
    logger.error(err.stack);
    next(err);
  });
};

/**
 * Delete a company from database filtered by id
 * @param req DELETE method with company id as path param
 * @param res NO CONTENT
 * @param next request
 */
export const remove = (req: Request, res: Response, next: NextFunction) => {
  const { companyId } = req.params;

  Company.findOne(
    { where: { id: companyId } },
  ).then((user) => {
    if (!user) {
      throw new APIError({
        message: 'Not found',
        status: httpStatus.NOT_FOUND,
        stack: `Can't delete company. Company [${companyId}] not exists`,
      });
    }
    Company.destroy({ where: { id: companyId } })
      .then((data) => {
        res.status(httpStatus.NO_CONTENT).json({ data });
      }).catch((err) => {
        logger.error(err.stack);
        next(err);
      });
  }).catch((err) => {
    logger.error(err.stack);
    next(err);
  });
};

const companyToTreeNode = (company: any) => ((company) ? {
  data: {
    id: company.id,
    kind: 'company',
    name: company.name,
    description: company.description,
    size: company.groups.length,
  },
  children: company.groups.map((item: any) => ({ data: { kind: 'group', ...item } })),
  expanded: (company.groups.length) > 0,
} : {});

/**
 * Return full info of a company
 * @param req GET method
 * @param res OK
 */
export const findAllCompanyTree = async (req: Request, res: Response) => {
  const companies = await Company.findAll({
    order: [['createdAt', 'ASC']],
    include: Group,
  });

  const result: Array<any> = [];

  if (companies) {
    companies.forEach((company) => {
      result.push(companyToTreeNode(company.toJSON()));
    });
  }

  res.status(httpStatus.OK).json(result);
};

/**
 * Return full info of an specific company
 * @param req GET method
 * @param res OK
 * @param next request
 */
export const findByIdCompanyTree = (req: Request, res: Response, next: NextFunction) => {
  const { companyId } = req.params;

  Company.findOne({
    where: {
      id: companyId,
    },
    order: [['createdAt', 'ASC']],
    include: Group,
  }).then((data) => {
    if (!data) {
      throw new APIError({
        message: 'Not found',
        status: httpStatus.NOT_FOUND,
        stack: `Can't find company. Company [${companyId}] not exists`,
      });
    }

    const result = (data) ? companyToTreeNode(data.toJSON()) : {};

    res.status(httpStatus.OK).json(result);
  }).catch((err) => {
    logger.error(err.stack);
    next(err);
  });
};
