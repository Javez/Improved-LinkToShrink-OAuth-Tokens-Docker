import express from 'express';
import request from 'supertest';
import linkController from '../../src/controllers/app-controller'; // Adjust the import path as needed

const app = express();
app.use(express.json());

// Define a route for each controller method
app.post('/shrink', linkController.shrinkUrl);
app.post('/add', linkController.addLink);
app.get('/getByUrl', linkController.getLinkByUrl);
app.get('/getByShortUrl', linkController.getLinkByShortUrl);

describe('Link Controller Tests', () => {
  it('should shrink a URL', async () => {
    const response = await request(app)
      .post('/shrink')
      .send({ url: 'https://example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should add a link', async () => {
    const response = await request(app)
      .post('/add')
      .send({ url: 'https://example.com', shortUrl: 'example' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      url: 'https://example.com',
      shortUrl: 'example'
    });
  });

  it('should get a link by URL', async () => {
    const response = await request(app)
      .get('/getByUrl')
      .query({ url: 'https://example.com' });

    expect(response.status).toBe(200);
    expect(response.text).toContain('your links: url:');
  });

  it('should get a link by short URL', async () => {
    const response = await request(app)
      .get('/getByShortUrl')
      .query({ shortUrl: 'example' });

    expect(response.status).toBe(200);
    expect(response.text).toContain('your links: url:');
  });
});
