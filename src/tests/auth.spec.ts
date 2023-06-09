import request from 'supertest';
import app from '../app';
import User from '../models/user.model';
import { connect } from './db-config';

describe('Some test', () => {
  let connectDB: any;

  beforeAll(async (): Promise<void> => {
    console.log('Starting the server...');
    connectDB = await connect();
  });

  afterEach(async () => {
    await connectDB.cleanup();
  });

  afterAll(async () => {
    await connectDB.disconnect();
  });

  // Tests for Signup end point
  it('Should signup a user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .set('content-type', 'application/json')
      .send({
        first_name: 'John',
        last_name: 'doe',
        email: 'john@doe.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('first_name', 'John');
    expect(res.body.user).toHaveProperty('last_name', 'doe');
    expect(res.body.user).toHaveProperty('email', 'john@doe.com');
  }, 5000); // Increase the timeout for this specific test

  it("Shouldn't signup a user", async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .set('content-type', 'application/json')
      .send({
        first_name: 'John',
        email: 'john@doe.com',
        password: 'password123',
      });

    expect(res.status).toBe(403);
  }, 5000);

  // Tests for Signin endpoints
  it('should login a user', async () => {
    // create user in out db
    const user = await User.create({
      first_name: 'John',
      last_name: 'doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const res = await request(app)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/json')
      .send({
        email: 'john@doe.com',
        password: '123456',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it("shouldn't login a user", async () => {
    // create user in out db
    const user = await User.create({
      first_name: 'John',
      last_name: 'doe',
      email: 'john@doe.com',
      password: '12345678',
    });

    const res = await request(app)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/json')
      .send({
        email: 'john@doe.com',
        password: '123456',
      });

    console.log(res.status, res.text, res.body);
    expect(res.status).toBe(500);
  });
});
