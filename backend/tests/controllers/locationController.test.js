const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const request = require('supertest');

const Item = require('../../models/Item');
const Location = require('../../models/Location');
const User = require('../../models/User');
const app = require('../../server');
const { connectDB, closeDB, clearDB } = require('../utils/db');

let token;

const generateUniqueUsername = () => `testuser_${new Date().getTime()}_${Math.random().toString(36).substr(2, 5)}`;
const generateUniqueLocationName = () => `Test Location_${new Date().getTime()}_${Math.random().toString(36).substr(2, 5)}`;

beforeAll(async () => {
  await connectDB();
  const hashedPassword = await bcrypt.hash('testpassword', 12);
  const username = generateUniqueUsername();
  const user = new User({ username, password: hashedPassword });
  await user.save();
  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

beforeEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeDB();
});

describe('Location API', () => {
  it('should create a new location', async () => {
    const locationName = generateUniqueLocationName();
    const res = await request(app)
      .post('/api/locations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: locationName,
        address: '123 Test St',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', locationName);

    // Log created location for debugging
    console.log('Created location:', res.body);
  });

  it('should get all locations', async () => {
    const locationName1 = generateUniqueLocationName();
    const locationName2 = generateUniqueLocationName();

    await new Location({ name: locationName1, address: '123 Test St' }).save();
    await new Location({ name: locationName2, address: '123 Test St' }).save();

    // Wait for a short time to ensure the locations are saved
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the database state before retrieval
    const locationsBefore = await Location.find();
    console.log('Locations before retrieval:', locationsBefore);

    const res = await request(app)
      .get('/api/locations')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    // Log retrieved locations for debugging
    console.log('Retrieved locations:', res.body);
  });

  it('should get a location by ID', async () => {
    const locationName = generateUniqueLocationName();
    const location = await new Location({
      name: locationName,
      address: '123 Test St',
    }).save();

    // Log the created location ID for debugging
    console.log('Created location ID:', location._id);

    const res = await request(app)
      .get(`/api/locations/${location._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', locationName);

    // Log retrieved location for debugging
    console.log('Retrieved location:', res.body);
  });

  it('should update a location by ID', async () => {
    const locationName = generateUniqueLocationName();
    const location = await new Location({
      name: locationName,
      address: '123 Test St',
    }).save();

    const updatedLocationName = generateUniqueLocationName();
    const res = await request(app)
      .put(`/api/locations/${location._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Updated ${locationName}`,
        address: '456 Updated St',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', `Updated ${locationName}`);

    // Log updated location for debugging
    console.log('Updated location:', res.body);
  });

  it('should delete a location by ID', async () => {
    const locationName = generateUniqueLocationName();
    const location = await new Location({
      name: locationName,
      address: '123 Test St',
    }).save();

    // Log the location ID before deletion for debugging
    console.log('Location ID before deletion:', location._id);

    const res = await request(app)
      .delete(`/api/locations/${location._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Location deleted successfully');

    // Log the database state after deletion for debugging
    const locationsAfter = await Location.find();
    console.log('Locations after deletion:', locationsAfter);
  });

  it('should not delete a location if it is associated with items', async () => {
    // Create a test item associated with the location
    const location = await Location.create({
      name: 'Test Location',
      address: '123 Test St',
    });
    await Item.create({
      name: 'Test Item',
      description: 'Test',
      quantity: 10,
      location_id: location._id,
    });

    const res = await request(app)
      .delete(`/api/locations/${location._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      'Cannot delete location associated with items'
    );
  });

  it('should delete a location if it is not associated with any items', async () => {
    // Remove the associated item
    await Item.deleteMany({});
    const location = await Location.create({
      name: 'Test Location',
      address: '123 Test St',
    });

    const res = await request(app)
      .delete(`/api/locations/${location._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Location deleted successfully');
  });
});
