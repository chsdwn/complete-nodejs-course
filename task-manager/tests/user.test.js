const request = require('supertest');
const app = require('../src/app');

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
