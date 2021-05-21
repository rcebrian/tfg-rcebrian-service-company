import request from 'supertest';
import {
  describe, it, expect,
} from '@jest/globals';
import httpStatus from 'http-status';
import app from '../../src/config/express.config';

describe('CONTROLLER /company', () => {
  const URI = '/api/company';

  const COMPANY = {
    name: 'TEST COMPANY NAME',
    description: 'TEST DESCRIPTION',
  };

  let newCompanyId: number;

  describe('POST /company', () => {
    it('should be 201 - CREATED', async () => {
      const result = await request(app).post(URI).send(COMPANY);
      newCompanyId = result.body.data.id;
      expect(result.body.data).toMatchObject(COMPANY);
      expect(result.status).toBe(httpStatus.CREATED);
    });

    it('should be 400 - BAD REQUEST', async () => {
      const result = await request(app).post(URI).send({ });
      expect(result.body.error).toHaveProperty('errors');
      expect(result.body.error.errors).toHaveLength(4);
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

  describe('GET /company/:id', () => {
    it('should be 200 - OK', async () => {
      const result = await request(app).get(`${URI}/${newCompanyId}`);
      expect(result.status).toBe(httpStatus.OK);
      expect(result.body.data).toMatchObject(COMPANY);
    });
  });

  describe('DELETE /company/:id', () => {
    it('should be 204 - NO CONTENT', async () => {
      const result = await request(app).delete(`${URI}/${newCompanyId}`);
      expect(result.status).toBe(httpStatus.NO_CONTENT);
    });
  });

  describe('PUT /company/:id', () => {
    const TO_UPDATE_COMPANY = {
      name: 'Updated name',
      description: 'Updated description',
    };
    it('should be 202 - ACCEPTED', async () => {
      const result = await request(app).put(`${URI}/${newCompanyId}`).send(TO_UPDATE_COMPANY);
      expect(result.status).toBe(httpStatus.ACCEPTED);
    });
  });
});
