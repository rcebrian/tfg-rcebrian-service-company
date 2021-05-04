import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Company, Group, UsersGroups } from '../repository/mysql/mysql.repository';

export const create = (req: Request, res: Response) => {
  Company.create({
    name: req.body.name,
    description: req.body.description,
  }).then((data: any) => {
    res.status(httpStatus.CREATED)
      .json({ data });
  });
};

/**
 * Get all companies from database
 * @param req GET method
 * @param res List of companies
 */
export const findAll = (req: Request, res: Response) => {
  Company.findAll()
    .then((data: any) => {
      res.status(httpStatus.OK)
        .json({ data });
    });
};

/**
 * Get a company from database filtered by id
 * @param req GET method with company id as path param
 * @param res one company or empty
 */
export const findById = (req: Request, res: Response) => {
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

  Company.destroy({ where: { id } }).then((data: any) => {
    res.status(httpStatus.NO_CONTENT)
      .json({ data });
  });
};

const companyToTreeNode = (company: any) => ((company) ? {
  data: {
    id: company.id,
    kind: 'company',
    name: company.name,
    description: company.description,
  },
  children: company.groups.map((item: any) => ({ data: { kind: 'group', ...item } })),
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
 */
export const findByIdCompanyTree = async (req: Request, res: Response) => {
  const { companyId } = req.params;

  const company = await Company.findOne({
    where: {
      id: companyId,
    },
    order: [['createdAt', 'ASC']],
    include: Group,
  });

  const result = (company) ? companyToTreeNode(company.toJSON()) : {};

  res.status(httpStatus.OK).json(result);
};
