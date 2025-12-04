import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../app.js';

describe('Report routes', () => {
  it('requires authentication to access sales report', async () => {
    const response = await request(app).get('/api/reports/sales');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token não fornecido' });
  });
});


