import request from 'supertest';
import { app } from '../src/server.js';

describe('Smart Queue API Endpoints', () => {
  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/kiosk/branches should return list of branches', async () => {
    const res = await request(app).get('/api/kiosk/branches');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
