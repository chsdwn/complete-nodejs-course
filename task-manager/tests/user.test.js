const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
  name: 'Ali',
  email: 'ali@mail.com',
  password: 'Ali12345',
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

it('should signup a new user', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Hulusi',
      email: 'hulusi@mail.com',
      password: 'Hulusi123',
    })
    .expect(201);
});

it('should login existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({ email: userOne.email, password: userOne.password })
    .expect(200);
});

it('should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({ email: 'some@mail.com', password: 'SomePassword' })
    .expect(400);
});
