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
  let newGroupId : number;

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
      newGroupId = result.body.data.id;
      expect(result.status).toBe(httpStatus.CREATED);
      expect(result.body.data).toMatchObject(GROUP);
    });

    it('should be 400 - BAD REQUEST', async () => {
      const result = await request(app).post(URI).send({ });
      expect(result.body.error).toHaveProperty('errors');
      expect(result.body.error.errors).toHaveLength(4);
      expect(result.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /company/{companyId}/groups', () => {
    it('should be 200 - OK', async () => {
      const result = await request(app).get(URI);
      expect(result.status).toBe(httpStatus.OK);
      expect(result.body.data).toBeDefined();
      expect(result.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /company/{companyId}/groups/{groupId}', () => {
    it('should be 200 - OK', async () => {
      const result = await request(app).get(`${URI}/${newGroupId}`);
      expect(result.status).toBe(httpStatus.OK);
      expect(result.body.data).toMatchObject(GROUP);
    });
  });

  describe('PUT /company/{companyId}/groups/{groupId}', () => {
    const TO_UPDATE_GROUP = {
      name: 'Updated name',
      description: 'Updated description',
    };
    it('should be 202 - ACCEPTED', async () => {
      const result = await request(app).put(`${URI}/${newGroupId}`).send(TO_UPDATE_GROUP);
      expect(result.status).toBe(httpStatus.ACCEPTED);
    });
  });

  describe('DELETE /company/{companyId}/groups/{groupId}', () => {
    it('should be 204 - NO CONTENT', async () => {
      const result = await request(app).delete(`${URI}/${newGroupId}`);
      expect(result.status).toBe(httpStatus.NO_CONTENT);
    });
  });
});
