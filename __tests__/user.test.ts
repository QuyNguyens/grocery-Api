// __tests__/app.test.ts
import request from 'supertest';
import app from '../src/app'; // Đường dẫn đến app.ts

describe('🌐 API Routes', () => {
  it('GET / should return list of users data', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: 'Danh sách user' });
  });
});
