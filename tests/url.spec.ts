import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';
import { connect } from './db-config';
import redisClient from '../src/config/redis.config';

describe('Test url route', () => {
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

  it('should shortern a url for an unauthenicated user', async () => {
    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .send({
        original_url: 'https://www.google.com',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('shortened_url');
    expect(res.body).toHaveProperty('qrcode');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    expect(res.body.user_id).toBe('');
    expect(res.body.clicks).toBe(0);
  });

  it('should shortern a url without a sub domain for an unauthenicated user', async () => {
    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .send({
        original_url: 'https://google.com',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('shortened_url');
    expect(res.body).toHaveProperty('qrcode');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    expect(res.body.user_id).toBe('');
    expect(res.body.clicks).toBe(0);
  });

  it("shouldn't shortern an invalid url for an unauthenicated user", async () => {
    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .send({
        original_url: 'www.google.com',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('err');
    expect(res.body.err).toBe(
      'Invalid URL, Try Again with a valid url e.g https://google.com'
    );
  });

  it('should shortern a url for an authenicated user', async () => {
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

    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.google.com',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('shortened_url');
    expect(res.body).toHaveProperty('qrcode');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    expect(res.body.user_id).toBe('john@doe.com');
    expect(res.body.clicks).toBe(0);
  });

  it('should shortern a url without a sub domain for an authenicated user', async () => {
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

    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://google.com',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('shortened_url');
    expect(res.body).toHaveProperty('qrcode');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    expect(res.body.user_id).toBe('john@doe.com');
    expect(res.body.clicks).toBe(0);
  });

  it("shouldn't shortern an invalid url for an authenicated user", async () => {
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

    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'www.google.com',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('err');
    expect(res.body.err).toBe(
      'Invalid URL, Try Again with a valid url e.g https://google.com'
    );
  });

  it('should shortern a url for an unauthenicated user with a custom url', async () => {
    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .send({
        original_url: 'https://www.google.com',
        custom: 'google',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('shortened_url');
    expect(res.body).toHaveProperty('qrcode');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    expect(res.body.user_id).toBe('');
    expect(res.body.clicks).toBe(0);
    expect(res.body.shortened_url.split('/')[3]).toBe('google');
  });

  it('should shortern a url without a sub domain for an unauthenicated user with a custom url', async () => {
    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .send({
        original_url: 'https://google.com',
        custom: 'google',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('shortened_url');
    expect(res.body).toHaveProperty('qrcode');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    expect(res.body.user_id).toBe('');
    expect(res.body.clicks).toBe(0);
    expect(res.body.shortened_url.split('/')[3]).toBe('google');
  });

  it("shouldn't shortern an invalid url for an unauthenicated user with a custom url", async () => {
    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .send({
        original_url: 'www.google.com',
        custom: 'google',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('err');
    expect(res.body.err).toBe(
      'Invalid URL, Try Again with a valid url e.g https://google.com'
    );
  });

  it('should shortern a url for an authenicated user with custom url', async () => {
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

    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.google.com',
        custom: 'seminar',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('shortened_url');
    expect(res.body).toHaveProperty('qrcode');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    expect(res.body.user_id).toBe('john@doe.com');
    expect(res.body.clicks).toBe(0);
    expect(res.body.shortened_url.split('/')[3]).toBe('seminar');
  });

  it('should shortern a url for an authenicated user', async () => {
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

    const res = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://google.com',
        custom: 'seminar',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('original_url');
    expect(res.body).toHaveProperty('shortened_url');
    expect(res.body).toHaveProperty('qrcode');
    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
    expect(res.body.user_id).toBe('john@doe.com');
    expect(res.body.clicks).toBe(0);
    expect(res.body.shortened_url.split('/')[3]).toBe('seminar');
  });

  it('should redirect shortened url to original url', async () => {
    const url = await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .send({
        original_url: 'https://www.google.com',
      });

    const res = await request(app)
      .get(`/${url.body.shortened_url.slice(-6)}`)
      .set('content-type', 'application/json');

    expect(res.status).toBe(302);
  });

  it('should get url info by id for an authenticated user', async () => {
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
    expect(res.body.clicks).toBe(0);
    expect(res.body._id).toBe(url.body._id);
  });

  it("shouldn't get url info by id for an unauthenticated user", async () => {
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

    const res = await request(app)
      .get(`/api/v1/url/${url.body._id}`)
      .set('content-type', 'application/json');

    expect(res.status).toBe(401);
    expect(res.text).toBe('Unauthorized');
  });

  it('should get all url info for an authenticated user', async () => {
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

    await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.google.com',
      });
    await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.facebook.com',
      });
    await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.twitter.com',
      });

    const res = await request(app)
      .get(`/api/v1/url/history`)
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toEqual(3);
  });

  it("shouldn't get all url info for an authenticated user", async () => {
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

    await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.google.com',
      });
    await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.facebook.com',
      });
    await request(app)
      .post('/api/v1/url')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + user.body.token)
      .send({
        original_url: 'https://www.twitter.com',
      });

    const res = await request(app)
      .get(`/api/v1/url/history`)
      .set('content-type', 'application/json');

    expect(res.status).toBe(401);
    expect(res.text).toBe('Unauthorized');
  });
});
