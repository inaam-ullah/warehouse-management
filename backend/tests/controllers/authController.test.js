const mongoose = require('mongoose');
const request = require('supertest');

const User = require('../../models/User');
const app = require('../../server');
const { connectDB, closeDB, clearDB } = require('../utils/db');

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeDB();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'testpassword',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
  });

  it('should not register an existing user', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'testpassword',
    });

    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'testpassword',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should login an existing user', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'testpassword',
    });

    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'testpassword',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should return an error if the username already exists', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'testpassword',
    });

    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'testpassword',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should handle login with non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'nonexistent',
      password: 'testpassword',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
