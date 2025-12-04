import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const userConstructor = vi.fn();
  userConstructor.findOne = vi.fn();
  return {
    User: userConstructor,
    bcrypt: {
      hash: vi.fn(),
    },
  };
});

vi.mock('../../Models/User.js', () => ({
  default: mocks.User,
}));

vi.mock('bcryptjs', () => ({
  default: mocks.bcrypt,
}));

const buildResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
  return res;
};

const signUpControllerModule = () => import('../../Controllers/signUpController.js');

describe('signUpController.createUser', () => {
  beforeEach(() => {
    mocks.User.mockReset();
    mocks.User.findOne.mockReset();
    mocks.bcrypt.hash.mockReset();
  });

  it('creates a user when payload is valid', async () => {
    const { default: signUpController } = await signUpControllerModule();
    const saveMock = vi.fn().mockResolvedValue(undefined);
    let createdPayload;

    mocks.User.findOne.mockResolvedValue(null);
    mocks.bcrypt.hash.mockResolvedValue('hashed-password');
    mocks.User.mockImplementation((payload) => {
      createdPayload = payload;
      return { ...payload, save: saveMock };
    });

    const req = {
      body: { nome: 'Rafa', email: 'rafa@example.com', senha: 'secret', isAdmin: false },
    };
    const res = buildResponse();

    await signUpController.createUser(req, res);

    expect(mocks.User.findOne).toHaveBeenCalledWith({ email: 'rafa@example.com' });
    expect(mocks.bcrypt.hash).toHaveBeenCalledWith('secret', 10);
    expect(mocks.User).toHaveBeenCalledTimes(1);
    expect(createdPayload).toEqual({
      nome: 'Rafa',
      email: 'rafa@example.com',
      senha: 'hashed-password',
      isAdmin: false,
    });
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário criado com sucesso!' });
  });

  it('returns 400 when email already exists', async () => {
    const { default: signUpController } = await signUpControllerModule();
    mocks.User.findOne.mockResolvedValue({ _id: '1' });

    const req = { body: { nome: 'Rafa', email: 'rafa@example.com', senha: 'secret' } };
    const res = buildResponse();

    await signUpController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email já cadastrado!' });
    expect(mocks.bcrypt.hash).not.toHaveBeenCalled();
    expect(mocks.User).not.toHaveBeenCalled();
  });

  it('returns 400 when required fields are missing', async () => {
    const { default: signUpController } = await signUpControllerModule();
    const req = { body: { email: 'rafa@example.com', senha: 'secret' } };
    const res = buildResponse();

    await signUpController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Nome, email e senha são obrigatórios' });
    expect(mocks.User.findOne).not.toHaveBeenCalled();
  });
});


