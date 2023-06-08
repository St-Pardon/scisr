import app from '../app';
import supertest from 'supertest';
const req = supertest(app);

describe('Some test', () => {
  beforeEach(() => {
    console.log('test')
  });

  it('get the url', async () => {
    const res = await req.get(
      'http://127.0.0.1:5353/api/v1/url/646a0eb8ce67ef195c693b32'
    );

    expect(res.status).toBe(200);
  });
});
