const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Ali',
  email: 'ali@mail.com',
  password: 'Ali12345',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, 'SECRET_KEY'),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

it('should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Hulusi',
      email: 'hulusi@mail.com',
      password: 'Hulusi123',
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  expect(user.password).not.toBe('Hulusi123');
  expect(response.body).toMatchObject({
    user: {
      name: 'Hulusi',
      email: 'hulusi@mail.com',
    },
    token: user.tokens[0].token,
  });
});

it('should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({ email: userOne.email, password: userOne.password })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

it('should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({ email: 'some@mail.com', password: 'SomePassword' })
    .expect(400);
});

it('should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

it('should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401);
});

it('should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

it('shoult not delete account for unauthenticated user', async () => {
  await request(app).delete('/users/me').send().expect(401);
});

it('should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

it('should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Veli',
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual('Veli');
});

it('should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Turkey',
    })
    .expect(400);
});
