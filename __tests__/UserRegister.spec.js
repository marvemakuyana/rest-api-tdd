const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/User');
const sequelize = require('../src/config/database');

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

describe('User Registration', () => {
  const postValidUser = () => {
    return request(app).post('/api/users').send({
      username: 'marv',
      email: 'marv@gmail.com',
      password: '123456',
    });
  };

  it('returns 200 OK when signup request is valid', async () => {
    const response = await postValidUser();
    expect(response.status).toBe(200);
  });

  it('returns sucess message when signup request is valid', async () => {
    const response = await postValidUser();
    expect(response.body.message).toBe('User created');
  });

  it('saves user to database', async () => {
    await postValidUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it('saves username and email to database', async () => {
    await postValidUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe('marv');
    expect(savedUser.email).toBe('marv@gmail.com');
  });

  it('hashes the password in the database', async () => {
    await postValidUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe('123456');
  });
});
