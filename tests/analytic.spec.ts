import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';
import { connect } from './db-config';
import redisClient from '../src/config/redis.config';

describe('Test analytics route', () => {
  let connectDB: any;

  beforeAll(async (): Promise<void> => {
    console.log('Starting the server...');
    connectDB = await connect();
    redisClient.connect(); // connect to redis
  });

  afterEach(async () => {
    await connectDB.cleanup();
  });

  afterAll(async () => {
    await connectDB.disconnect();
    await redisClient.disconnect();
  });

  it('should get new clicks count for a url', async () => {
    await User.create({
      first_name: 'John',
      last_name: 'doe',
      email: 'john@doe.com',
      password: '12345678',
    });

    const user = await request(app)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/json')
      .send({
        email: 'john@doe.com',
        password: '12345678',
      });

    const url = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.google.com',
      });

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    const res = await request(app)
      .get(`/api/v1/url/${url.body._id}`)
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('shortened_url');
    expect(res.body).toHaveProperty('qrcode');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    expect(res.body.user_id).toBe('john@doe.com');
    expect(res.body.clicks).toBe(4);
    expect(res.body._id).toBe(url.body._id);
  });

  it('should get new clicks count for a url', async () => {
    await User.create({
      first_name: 'John',
      last_name: 'doe',
      email: 'john@doe.com',
      password: '12345678',
    });

    const user = await request(app)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/json')
      .send({
        email: 'john@doe.com',
        password: '12345678',
      });

    const url = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.google.com',
      });

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    const res = await request(app)
      .get(`/api/v1/url/${url.body._id}`)
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('shortened_url');
    expect(res.body).toHaveProperty('qrcode');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    expect(res.body.user_id).toBe('john@doe.com');
    expect(res.body.clicks).toBe(7);
    expect(res.body._id).toBe(url.body._id);
  });

  it("shouldn't get clicks count for a url for unauthenticated user", async () => {
    await User.create({
      first_name: 'John',
      last_name: 'doe',
      email: 'john@doe.com',
      password: '12345678',
    });

    const user = await request(app)
      .post('/api/v1/auth/signin')
      .set('content-type', 'application/json')
      .send({
        email: 'john@doe.com',
        password: '12345678',
      });

    const url = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.google.com',
      });

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    const res = await request(app)
      .get(`/api/v1/url/${url.body._id}`)
      .set('content-type', 'application/json');

    expect(res.status).toBe(401);
    expect(res.text).toBe('Unauthorized');
  });
});
