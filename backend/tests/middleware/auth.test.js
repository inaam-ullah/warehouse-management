const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const request = require('supertest');

const { connectDB, closeDB, clearDB } = require('../utils/db');
const auth = require('../../middleware/auth');

const app = express();

app.get('/protected', auth, (req, res) => {
  res.status(200).send({ message: 'You are authorized' });
});

describe('Auth Middleware', () => {
  let token;

  beforeAll(async () => {
    await connectDB();
    token = jwt.sign({ userId: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    await closeDB();
  });

  test('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token, authorization denied');
  });

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token is not valid');
  });

  test('should allow access with valid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('You are authorized');
  });
});
