import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '@server/routes';

describe('Authentication API', () => {
  let app: express.Application;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe('GET /api/auth/user', () => {
    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .expect(401);

      expect(response.body).toEqual({
        message: 'Unauthorized'
      });
    });
  });

  describe('GET /api/login', () => {
    it('should redirect to Replit auth', async () => {
      const response = await request(app)
        .get('/api/login')
        .expect(302);

      expect(response.headers.location).toContain('replit.com');
    });
  });
});