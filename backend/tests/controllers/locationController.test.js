const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const request = require('supertest');

const Location = require('../../models/Location');
const User = require('../../models/User');
const app = require('../../server');

let token;

const generateUniqueUsername = () =>
  `testuser_${new Date().getTime()}_${Math.random().toString(36).substr(2, 5)}`;
const generateUniqueLocationName = () =>
  `Test Location_${new Date().getTime()}_${Math.random().toString(36).substr(2, 5)}`;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  await Location.deleteMany({});
  await User.deleteMany({});

  const hashedPassword = await bcrypt.hash('testpassword', 12);
  const username = generateUniqueUsername();
  const user = new User({ username, password: hashedPassword });
  await user.save();
  token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
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
  });

  it('should get all locations', async () => {
    const locationName1 = generateUniqueLocationName();
    const locationName2 = generateUniqueLocationName();

    await new Location({ name: locationName1, address: '123 Test St' }).save();
    await new Location({ name: locationName2, address: '123 Test St' }).save();

    const res = await request(app)
      .get('/api/locations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should get a location by ID', async () => {
    const locationName = generateUniqueLocationName();
    const location = await new Location({
      name: locationName,
      address: '123 Test St',
    }).save();

    const res = await request(app)
      .get(`/api/locations/${location._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', locationName);
  });

  it('should update a location by ID', async () => {
    const locationName = generateUniqueLocationName();
    const location = await new Location({
      name: locationName,
      address: '123 Test St',
    }).save();

    const res = await request(app)
      .put(`/api/locations/${location._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Updated ${locationName}`,
        address: '456 Updated St',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', `Updated ${locationName}`);
  });

  it('should delete a location by ID', async () => {
    const locationName = generateUniqueLocationName();
    const location = await new Location({
      name: locationName,
      address: '123 Test St',
    }).save();

    const res = await request(app)
      .delete(`/api/locations/${location._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Location deleted');
  });
});
