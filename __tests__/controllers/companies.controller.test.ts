import request from 'supertest';
import {
  describe, it, expect,
} from '@jest/globals';
import httpStatus from 'http-status';
import app from '../../src/config/express.config';

describe('CONTROLLER /company', () => {
  const URI = '/api/company';

  describe('POST /company', () => {
    const COMPANY = {
      name: 'TEST COMPANY NAME',
      description: 'TEST DESCRIPTION',
    };
    it('should be 201 - CREATED', async () => {
      const result = await request(app).post(URI).send(COMPANY);
      expect(result.body.data).toMatchObject(COMPANY);
      expect(result.status).toBe(httpStatus.CREATED);
    });

    it('should be 400 - BAD REQUEST', async () => {
      const result = await request(app).post(URI).send({ });
      expect(result.body).toHaveProperty('errors');
      expect(result.body.errors).toHaveLength(2);
      expect(result.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /company', () => {
    it('should be 200 - OK', async () => {
      const result = await request(app).get(URI);
      expect(result.status).toBe(httpStatus.OK);
      expect(result.body.data.length).toBeGreaterThan(0);
    });
  });
});
