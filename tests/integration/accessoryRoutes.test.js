import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../app.js';

const acessorioModelMock = vi.hoisted(() => ({
  find: vi.fn(),
  create: vi.fn(),
}));

const categoriaModelMock = vi.hoisted(() => ({
  countDocuments: vi.fn(),
}));

const buildListChain = (result) => {
  const chain = {
    populate: vi.fn(),
    sort: vi.fn(),
  };
  chain.populate.mockReturnValue(chain);
  chain.sort.mockResolvedValue(result);
  return chain;
};

vi.mock('../../Models/Acessorio.js', () => ({
  default: acessorioModelMock,
}));

vi.mock('../../Models/Categoria.js', () => ({
  default: categoriaModelMock,
}));

const adminToken = () =>
  jwt.sign(
    {
      sub: 'admin',
      email: 'admin@example.com',
      nome: 'Admin',
      isAdmin: true,
    },
    'dev-secret',
  );

describe('Accessory routes', () => {
  beforeEach(() => {
    Object.values(acessorioModelMock).forEach((fn) => fn.mockReset());
    Object.values(categoriaModelMock).forEach((fn) => fn.mockReset());
  });

  it('lists accessories applying default filters', async () => {
    const accessories = [{ _id: 'a1', nome: 'Boné' }];
    const chain = buildListChain(accessories);
    acessorioModelMock.find.mockReturnValue(chain);

    const response = await request(app).get('/api/accessories?ativo=all&category=cat123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(accessories);
    expect(acessorioModelMock.find).toHaveBeenCalledWith({ categorias: 'cat123' });
    expect(chain.populate).toHaveBeenCalledWith('categorias');
    expect(chain.sort).toHaveBeenCalledWith({ nome: 1 });
  });

  it('requires admin auth to create accessories', async () => {
    const response = await request(app).post('/api/accessories').send({ nome: 'Boné', preco: 10 });

    expect(response.status).toBe(401);
    expect(acessorioModelMock.create).not.toHaveBeenCalled();
  });
});


