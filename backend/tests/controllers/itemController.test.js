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
let locationId;

const generateUniqueUsername = () => `testuser_${new Date().getTime()}_${Math.random().toString(36).substr(2, 5)}`;
const generateUniqueLocationName = () => `Test Location_${new Date().getTime()}_${Math.random().toString(36).substr(2, 5)}`;
const generateUniqueItemName = () => `Test Item_${new Date().getTime()}_${Math.random().toString(36).substr(2, 5)}`;

beforeAll(async () => {
  await connectDB();
  const hashedPassword = await bcrypt.hash('testpassword', 12);
  const username = generateUniqueUsername();
  const user = new User({ username, password: hashedPassword });
  await user.save();
  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const locationName = generateUniqueLocationName();
  const location = new Location({
    name: locationName,
    address: '123 Test St',
  });
  await location.save();
  locationId = location._id;
});

beforeEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeDB();
});

describe('Item API', () => {
  it('should create a new item', async () => {
    const itemName = generateUniqueItemName();
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: itemName,
        description: 'Test Description',
        quantity: 10,
        location_id: locationId,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', itemName);

    // Log created item for debugging
    console.log('Created item:', res.body);
  });

  it('should get all items', async () => {
    const itemName = generateUniqueItemName();
    await new Item({
      name: itemName,
      description: 'Test Description',
      quantity: 10,
      location_id: locationId,
    }).save();

    // Log the database state before retrieval
    const itemsBefore = await Item.find();
    console.log('Items before retrieval:', itemsBefore);

    const res = await request(app)
      .get('/api/items')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);

    // Log retrieved items for debugging
    console.log('Retrieved items:', res.body);
  });

  it('should get an item by ID', async () => {
    const itemName = generateUniqueItemName();
    const item = await new Item({
      name: itemName,
      description: 'Test Description',
      quantity: 10,
      location_id: locationId,
    }).save();

    // Log the created item ID for debugging
    console.log('Created item ID:', item._id);

    const res = await request(app)
      .get(`/api/items/${item._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', itemName);

    // Log retrieved item for debugging
    console.log('Retrieved item:', res.body);
  });

  it('should update an item by ID', async () => {
    const itemName = generateUniqueItemName();
    const item = await new Item({
      name: itemName,
      description: 'Test Description',
      quantity: 10,
      location_id: locationId,
    }).save();

    const updatedItemName = generateUniqueItemName();
    const res = await request(app)
      .put(`/api/items/${item._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: updatedItemName,
        description: 'Updated Description',
        quantity: 20,
        location_id: locationId,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', updatedItemName);

    // Log updated item for debugging
    console.log('Updated item:', res.body);
  });

  it('should delete an item by ID', async () => {
    const itemName = generateUniqueItemName();
    const item = await new Item({
      name: itemName,
      description: 'Test Description',
      quantity: 10,
      location_id: locationId,
    }).save();

    // Log the item ID before deletion for debugging
    console.log('Item ID before deletion:', item._id);

    const res = await request(app)
      .delete(`/api/items/${item._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Item deleted successfully');

    // Log the database state after deletion for debugging
    const itemsAfter = await Item.find();
    console.log('Items after deletion:', itemsAfter);
  });
});
