const express = require('express');
const request = require('supertest');

const errorHandler = require('../../middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    // Intentional error route for testing
    app.get('/error', (req, res, next) => {
      const err = new Error('Test error');
      res.status(500);
      next(err);
    });

    app.use(errorHandler);
  });

  test('should return 500 and error message in development mode', async () => {
    process.env.NODE_ENV = 'development';
    const res = await request(app).get('/error');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Test error');
    expect(res.body.stack).toBeTruthy();
  });

  test('should return 500 and error message without stack in production mode', async () => {
    process.env.NODE_ENV = 'production';
    const res = await request(app).get('/error');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Test error');
    expect(res.body.stack).toBe('🥞');
  });
});
