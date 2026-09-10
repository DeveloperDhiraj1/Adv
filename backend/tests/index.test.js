import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../index.js';

describe('API Routes', function() {
  describe('GET /', function() {
    it('Should return API running message', async function() {
      const response = await request(app).get('/');
      assert.equal(response.status, 200);
      assert.equal(response.text, 'API is running...');
    });

    it('Should return plain text response type', async function() {
      const response = await request(app).get('/');
      assert.match(response.headers['content-type'], /text\/html/);
    });
  });

  describe('GET /unknown-route', function() {
    it('Should return 404 for unknown route', async function() {
      const response = await request(app).get('/unknown-route');
      assert.equal(response.status, 404);
    });
  });

  describe('PUT /experts/profile', function() {
    it('Should reject unauthenticated access', async function() {
      const response = await request(app)
        .put('/experts/profile')
        .send({ headline: 'Test Headline' });

      assert.equal(response.status, 401);
      assert.equal(response.body.success, false);
    });
  });
});