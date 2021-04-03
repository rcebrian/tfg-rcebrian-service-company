import request from 'supertest';
import {
  describe, it, expect, beforeAll,
} from '@jest/globals';
import httpStatus from 'http-status';
import app from '../../src/config/express.config';

describe('CONTROLLER /company', () => {
  const COMPANY_URI = '/api/company';
  let companyResponse: any;
  let URI : string;

  const COMPANY = {
    name: 'COMPANY TEST',
    description: 'COMPANY DESCRIPTION',
  };

  const GROUP = {
    name: 'TEST GROUP NAME',
    description: 'TEST DESCRIPTION',
  };

  beforeAll(async () => {
    companyResponse = await request(app).post(COMPANY_URI).send(COMPANY);
    URI = `${COMPANY_URI}/${companyResponse.body.data.id}/groups`;
  });

  describe('POST /company/{companyId}/groups', () => {
    it('should be 201 - CREATED', async () => {
      const result = await request(app).post(URI).send(GROUP);
      expect(result.status).toBe(httpStatus.CREATED);
      expect(result.body.data).toMatchObject(GROUP);
    });

    it('should be 400 - BAD REQUEST', async () => {
      const result = await request(app).post(URI).send({ });
      expect(result.body).toHaveProperty('errors');
      expect(result.body.errors).toHaveLength(2);
      expect(result.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /company/{companyId}/groups', () => {
    it('should be 200 - CREATED', async () => {
      const result = await request(app).get(URI);
      expect(result.status).toBe(httpStatus.OK);
      expect(result.body.data).toBeDefined();
      expect(result.body.data.length).toBeGreaterThan(0);
    });
  });
});
