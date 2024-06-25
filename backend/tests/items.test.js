const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const Location = require('../models/Location');
const User = require('../models/User');

let token;
let locationId;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/warehouse_test', { useNewUrlParser: true, useUnifiedTopology: true });
  await Item.deleteMany({});
  await Location.deleteMany({});
  await User.deleteMany({});

  const user = new User({ username: 'testuser', password: 'testpassword' });
  await user.save();
  token = 'Bearer ' + jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });

  const location = new Location({ name: 'Test Location', address: '123 Test St' });
  await location.save();
  locationId = location._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Item API', () => {
  it('should create a new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', token)
      .send({
        name: 'Test Item',
        description: 'Test Description',
        quantity: 10,
        location_id: locationId
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Item');
  });

  it('should get all items', async () => {
    const res = await request(app)
      .get('/api/items')
      .set('Authorization', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
  });
});
