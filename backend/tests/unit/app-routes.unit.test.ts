// app-routes.test.ts
import request from 'supertest';
import express from 'express';
import { router } from '../../src/routes/app-routes';
import { createToken } from '../../src/middleware/auth/auth';
const app = express();
app.use(express.json());
app.use('/', router);

// Assuming you have a function to generate a valid token
const token = createToken("test", "test");

describe('Routes', () => {
  test('POST /login/user', async () => {
    const response = await request(app)
      .post('/login/user')
      .send({ username: 'test', password: 'test' });
    expect(response.statusCode).toBe(200);
    // Add more assertions based on your application's behavior
  });

  test('POST /register/user', async () => {
    const response = await request(app)
      .post('/register/user')
      .send({ username: 'test', password: 'test', email: 'test@test.com' });
    expect(response.statusCode).toBe(200);
    // Add more assertions based on your application's behavior
  });

  test('POST /auth/googleuser', async () => {
    const response = await request(app)
      .post('/auth/googleuser')
      .send({ username: 'test', email: 'test@test.com' });
    expect(response.statusCode).toBe(200);
    // Add more assertions based on your application's behavior
  });

  test('GET /', async () => {
    const response = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Protected resource'
    });
  });

  test('POST /shrinkUrl', async () => {
    const response = await request(app)
      .post('/shrinkUrl')
      .set('Authorization', `Bearer ${token}`)
      .send({ url: 'http://example.com' });
    expect(response.statusCode).toBe(200);
    // Add more assertions based on your application's behavior
  });

  test('POST /addLink', async () => {
    const response = await request(app)
      .post('/addLink')
      .set('Authorization', `Bearer ${token}`)
      .send({ url: 'http://example.com', shortUrl: 'http://shrinked.com' });
    expect(response.statusCode).toBe(200);
    // Add more assertions based on your application's behavior
  });

  test('GET /getLinkByUrl', async () => {
    const response = await request(app)
      .get('/getLinkByUrl')
      .set('Authorization', `Bearer ${token}`)
      .query({ url: 'http://example.com' });
    expect(response.statusCode).toBe(200);
    // Add more assertions based on your application's behavior
  });

  test('GET /getLinkByShortUrl', async () => {
    const response = await request(app)
      .get('/getLinkByShortUrl')
      .set('Authorization', `Bearer ${token}`)
      .query({ shortUrl: 'http://shrinked.com' });
    expect(response.statusCode).toBe(200);
    // Add more assertions based on your application's behavior
  });
});