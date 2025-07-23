// __tests__/app.test.ts
import request from 'supertest';
import app from '../src/app'; // Đường dẫn đến app.ts

describe('🌐 API Routes', () => {
  it('GET / should return default API message', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'API is running' });
  });

  it('GET /not-found should return 404', async () => {
    const res = await request(app).get('/not-found');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Not Found' });
  });
});
