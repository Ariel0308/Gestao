import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../app.js';

const produtoModelMock = vi.hoisted(() => ({
  findById: vi.fn(),
}));

const movimentoModelMock = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock('../../Models/Produto.js', () => ({
  default: produtoModelMock,
}));

vi.mock('../../Models/Movimento.js', () => ({
  default: movimentoModelMock,
}));

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

describe('Purchase routes', () => {
  beforeEach(() => {
    Object.values(produtoModelMock).forEach((fn) => fn.mockReset());
    Object.values(movimentoModelMock).forEach((fn) => fn.mockReset());
  });

  it('requires authentication to create purchases', async () => {
    const response = await request(app).post('/api/purchase').send({ productId: 'p1', quantity: 1 });

    expect(response.status).toBe(401);
    expect(movimentoModelMock.create).not.toHaveBeenCalled();
  });

  it('creates a purchase and adjusts stock', async () => {
    const product = {
      _id: 'p1',
      estoque: 5,
      preco: 120,
      save: vi.fn().mockResolvedValue(undefined),
    };
    produtoModelMock.findById.mockResolvedValue(product);
    movimentoModelMock.create.mockResolvedValue({ _id: 'mov1' });

    const response = await request(app)
      .post('/api/purchase')
      .set('Authorization', `Bearer ${userToken()}`)
      .send({ productId: 'p1', quantity: 2, accessories: ['acc1', '', null] });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Compra registrada', estoque: 3 });
    expect(produtoModelMock.findById).toHaveBeenCalledWith('p1');
    expect(product.save).toHaveBeenCalled();
    expect(movimentoModelMock.create).toHaveBeenCalledWith({
      tipo: 'Saida',
      quantidade: 2,
      valor_unitario: 120,
      observacao: 'Compra do site',
      id_produto: 'p1',
      id_user: 'user-123',
      acessorios: ['acc1'],
    });
  });
});


