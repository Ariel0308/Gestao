import request from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';
import app from '../../app.js';

const userToken = () =>
  jwt.sign(
    {
      sub: 'user-123',
      email: 'user@example.com',
      nome: 'User',
      isAdmin: false,
    },
    'dev-secret',
  );

describe('Movement routes', () => {
  it('requires admin privileges to list movements', async () => {
    const response = await request(app)
      .get('/api/movements')
      .set('Authorization', `Bearer ${userToken()}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Acesso restrito a administradores' });
  });
});


