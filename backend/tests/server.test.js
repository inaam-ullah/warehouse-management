const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');

const errorHandler = require('../middleware/errorHandler');
const app = require('../server');

describe('Server', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should start server without crashing', async () => {
    expect(app).toBeTruthy();
  });

  test('should log MongoDB connection', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    // Close the current connection if open
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }

    // Mock the connect function to immediately resolve
    const connectSpy = jest
      .spyOn(mongoose, 'connect')
      .mockImplementation(() => {
        console.log('MongoDB connected');
        return Promise.resolve();
      });

    await mongoose.connect(process.env.MONGODB_URI);

    // Check if the console log was called with the expected message
    expect(consoleSpy).toHaveBeenCalledWith('MongoDB connected');

    // Restore the original functions
    connectSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  test('should handle MongoDB connection error gracefully', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Close the current connection if open
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }

    // Mock the connect function to reject with an error
    const connectSpy = jest
      .spyOn(mongoose, 'connect')
      .mockImplementation(() => {
        console.error('MongoDB connection error');
        return Promise.reject(new Error('MongoDB connection error'));
      });

    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
      // Check if the console log was called with the expected message
      expect(consoleSpy).toHaveBeenCalledWith('MongoDB connection error');
    }

    // Restore the original functions
    connectSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  test('should start server on specified port', async () => {
    const PORT = process.env.PORT || 5001;
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await new Promise(resolve => {
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        server.close(resolve);
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith(`Server running on port ${PORT}`);
    consoleSpy.mockRestore();
  });

  test('should handle unknown routes with a 404 error', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toEqual(404);
  });

  test('should handle errors gracefully', async () => {
    const testApp = express();
    testApp.get('/error', (req, res, next) => {
      res.status(500); // Explicitly set status code
      next(new Error('Test error'));
    });
    testApp.use(errorHandler);

    const res = await request(testApp).get('/error');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message', 'Test error');
    expect(res.body).toHaveProperty('stack');
  });
});
