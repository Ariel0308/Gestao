import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../app.js';

const produtoModelMock = vi.hoisted(() => ({
  find: vi.fn(),
  countDocuments: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
}));

const categoriaModelMock = vi.hoisted(() => ({
  exists: vi.fn(),
  findOne: vi.fn(),
}));

const buildQueryChain = (result) => {
  const chain = {
    sort: vi.fn(),
    skip: vi.fn(),
    limit: vi.fn(),
    populate: vi.fn(),
  };
  chain.sort.mockReturnValue(chain);
  chain.skip.mockReturnValue(chain);
  chain.limit.mockReturnValue(chain);
  chain.populate.mockResolvedValue(result);
  return chain;
};

vi.mock('../../Models/Produto.js', () => ({
  default: produtoModelMock,
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

describe('Product routes', () => {
  beforeEach(() => {
    Object.values(produtoModelMock).forEach((fn) => fn.mockReset());
    Object.values(categoriaModelMock).forEach((fn) => fn.mockReset());
  });

  it('lists products with filters and pagination', async () => {
    const products = [{ _id: 'p1', nome: 'Camisa', preco: 99 }];
    const chain = buildQueryChain(products);
    produtoModelMock.find.mockReturnValue(chain);
    produtoModelMock.countDocuments.mockResolvedValue(10);

    const response = await request(app).get(
      '/api/products?category=507f1f77bcf86cd799439011&colors=Azul,Vermelho&sizes=P,M&priceMin=50&priceMax=150&search=camisa&featured=true&page=2&limit=5&sort=price-desc',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: products,
      pagination: { page: 2, limit: 5, total: 10, totalPages: 2 },
    });
    expect(produtoModelMock.find).toHaveBeenCalledWith({
      id_categoria: '507f1f77bcf86cd799439011',
      cores: { $in: ['azul', 'vermelho'] },
      tamanhos: { $in: ['P', 'M'] },
      preco: { $gte: 50, $lte: 150 },
      nome: { $regex: 'camisa', $options: 'i' },
      isFeatured: true,
    });
    expect(chain.sort).toHaveBeenCalledWith({ preco: -1 });
    expect(chain.skip).toHaveBeenCalledWith(5);
    expect(chain.limit).toHaveBeenCalledWith(5);
    expect(chain.populate).toHaveBeenCalledWith('id_categoria');
    expect(produtoModelMock.countDocuments).toHaveBeenCalledWith({
      id_categoria: '507f1f77bcf86cd799439011',
      cores: { $in: ['azul', 'vermelho'] },
      tamanhos: { $in: ['P', 'M'] },
      preco: { $gte: 50, $lte: 150 },
      nome: { $regex: 'camisa', $options: 'i' },
      isFeatured: true,
    });
  });

  it('returns product details by id', async () => {
    const product = { _id: 'p1', nome: 'Camisa' };
    const populateMock = vi.fn().mockResolvedValue(product);
    produtoModelMock.findById.mockReturnValue({ populate: populateMock });

    const response = await request(app).get('/api/products/p1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(product);
    expect(produtoModelMock.findById).toHaveBeenCalledWith('p1');
    expect(populateMock).toHaveBeenCalledWith('id_categoria');
  });

  it('requires admin authentication to create products', async () => {
    const response = await request(app).post('/api/products').send({ nome: 'Camisa' });

    expect(response.status).toBe(401);
    expect(produtoModelMock.create).not.toHaveBeenCalled();
  });

  it('creates a product when admin payload is valid', async () => {
    const saved = { _id: 'p1', nome: 'Camisa Azul' };
    categoriaModelMock.exists.mockResolvedValue(true);
    produtoModelMock.create.mockResolvedValue(saved);

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        nome: 'Camisa Azul',
        descricao: 'Algodão',
        tamanhos: 'P,M',
        cores: 'Azul, Vermelho',
        preco: '199.9',
        estoque: '20',
        images: 'img1,img2',
        isFeatured: 'true',
        id_categoria: '507f1f77bcf86cd799439011',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(saved);
    expect(categoriaModelMock.exists).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011' });
    expect(produtoModelMock.create).toHaveBeenCalledWith({
      nome: 'Camisa Azul',
      descricao: 'Algodão',
      tamanhos: ['P', 'M'],
      cores: ['azul', 'vermelho'],
      preco: 199.9,
      estoque: 20,
      images: ['img1', 'img2'],
      isFeatured: true,
      id_categoria: '507f1f77bcf86cd799439011',
    });
  });
});


