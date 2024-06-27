const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const request = require('supertest');

const Item = require('../../models/Item');
const Location = require('../../models/Location');
const User = require('../../models/User');
const app = require('../../server');

let token;
let locationId;

const generateUniqueUsername = () => `testuser_${new Date().getTime()}`;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  await Item.deleteMany({});
  await Location.deleteMany({});
  await User.deleteMany({});

  const hashedPassword = await bcrypt.hash('testpassword', 12);
  const username = generateUniqueUsername();
  const user = new User({ username, password: hashedPassword });
  await user.save();
  token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });

  const location = new Location({
    name: 'Test Location',
    address: '123 Test St',
  });
  await location.save();
  locationId = location._id;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Item API', () => {
  it('should create a new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Item',
        description: 'Test Description',
        quantity: 10,
        location_id: locationId,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Item');
  });

  it('should get all items', async () => {
    await new Item({
      name: 'Test Item',
      description: 'Test Description',
      quantity: 10,
      location_id: locationId,
    }).save();

    const res = await request(app)
      .get('/api/items')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
  });

  it('should get an item by ID', async () => {
    const item = await new Item({
      name: 'Test Item',
      description: 'Test Description',
      quantity: 10,
      location_id: locationId,
    }).save();

    const res = await request(app)
      .get(`/api/items/${item._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Test Item');
  });

  it('should update an item by ID', async () => {
    const item = await new Item({
      name: 'Test Item',
      description: 'Test Description',
      quantity: 10,
      location_id: locationId,
    }).save();

    const res = await request(app)
      .put(`/api/items/${item._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Test Item',
        description: 'Updated Description',
        quantity: 20,
        location_id: locationId,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Test Item');
  });

  it('should delete an item by ID', async () => {
    const item = await new Item({
      name: 'Test Item',
      description: 'Test Description',
      quantity: 10,
      location_id: locationId,
    }).save();

    const res = await request(app)
      .delete(`/api/items/${item._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Item deleted successfully');
  });
});
