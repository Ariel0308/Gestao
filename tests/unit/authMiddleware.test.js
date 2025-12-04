import { describe, expect, it, vi, beforeEach } from 'vitest';

const jwtMock = vi.hoisted(() => ({
  verify: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
  default: jwtMock,
}));

const { authenticate, requireAdmin } = await import('../../Middlewares/authMiddleware.js');

const buildResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
  return res;
};

describe('authMiddleware', () => {
  beforeEach(() => {
    jwtMock.verify.mockReset();
  });

  it('returns 401 when no authorization header is provided', () => {
    const req = { headers: {} };
    const res = buildResponse();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalid' } };
    const res = buildResponse();
    const next = vi.fn();
    jwtMock.verify.mockImplementation(() => {
      throw new Error('invalid signature');
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido', error: 'invalid signature' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches the user to the request and calls next when token is valid', () => {
    const payload = { sub: 'user', isAdmin: false };
    jwtMock.verify.mockReturnValue(payload);
    const req = { headers: { authorization: 'Bearer valid' } };
    const res = buildResponse();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it('requireAdmin blocks non-admin users', () => {
    const req = { user: { isAdmin: false } };
    const res = buildResponse();
    const next = vi.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acesso restrito a administradores' });
    expect(next).not.toHaveBeenCalled();
  });

  it('requireAdmin calls next when the user is admin', () => {
    const req = { user: { isAdmin: true } };
    const res = buildResponse();
    const next = vi.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});


