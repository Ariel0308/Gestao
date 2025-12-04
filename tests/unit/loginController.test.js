import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    userModel: {
      findOne: vi.fn(),
    },
    bcrypt: {
      compare: vi.fn(),
    },
    jwt: {
      sign: vi.fn(),
    },
  };
});

vi.mock('../../Models/User.js', () => ({
  default: mocks.userModel,
}));

vi.mock('bcryptjs', () => ({
  default: mocks.bcrypt,
}));

vi.mock('jsonwebtoken', () => ({
  default: mocks.jwt,
}));

const buildResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
  return res;
};

const loginControllerModule = () => import('../../Controllers/loginController.js');

describe('loginController', () => {
  beforeEach(() => {
    Object.values(mocks.userModel).forEach((fn) => fn.mockReset());
    Object.values(mocks.bcrypt).forEach((fn) => fn.mockReset());
    Object.values(mocks.jwt).forEach((fn) => fn.mockReset());
  });

  it('returns a token and user information when credentials are valid', async () => {
    const { default: loginController } = await loginControllerModule();
    const user = {
      _id: 'user-id',
      nome: 'Usuário Teste',
      email: 'user@example.com',
      senha: 'hashed',
      isAdmin: true,
    };

    mocks.userModel.findOne.mockResolvedValue(user);
    mocks.bcrypt.compare.mockResolvedValue(true);
    mocks.jwt.sign.mockReturnValue('signed-token');

    const req = { body: { email: 'user@example.com', senha: 'secret' } };
    const res = buildResponse();

    await loginController.login(req, res);

    expect(mocks.userModel.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(mocks.bcrypt.compare).toHaveBeenCalledWith('secret', 'hashed');
    expect(mocks.jwt.sign).toHaveBeenCalledWith(
      {
        sub: 'user-id',
        email: 'user@example.com',
        nome: 'Usuário Teste',
        isAdmin: true,
      },
      expect.any(String),
      { expiresIn: '8h' },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'signed-token',
      user: {
        id: 'user-id',
        nome: 'Usuário Teste',
        email: 'user@example.com',
        isAdmin: true,
      },
    });
  });

  it('returns 400 when email is not found or password is invalid', async () => {
    const { default: loginController } = await loginControllerModule();
    mocks.userModel.findOne.mockResolvedValue(null);

    const req = { body: { email: 'missing@example.com', senha: 'secret' } };
    const res = buildResponse();

    await loginController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email ou senha inválidos!' });

    mocks.userModel.findOne.mockResolvedValue({ senha: 'hash' });
    mocks.bcrypt.compare.mockResolvedValue(false);

    await loginController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email ou senha inválidos!' });
  });
});


