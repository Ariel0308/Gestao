import request from 'supertest';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../app.js';

const categoriaModelMock = vi.hoisted(() => ({
  find: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  findByIdAndDelete: vi.fn(),
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

describe('Category routes', () => {
  beforeEach(() => {
    Object.values(categoriaModelMock).forEach((fn) => fn.mockReset());
  });

  it('lists categories sorted by name', async () => {
    const categories = [
      { _id: '1', nome: 'Blusas' },
      { _id: '2', nome: 'Camisetas' },
    ];
    const sortMock = vi.fn().mockResolvedValue(categories);
    categoriaModelMock.find.mockReturnValue({ sort: sortMock });

    const response = await request(app).get('/api/categories');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(categories);
    expect(categoriaModelMock.find).toHaveBeenCalled();
    expect(sortMock).toHaveBeenCalledWith({ nome: 1 });
  });

  it('requires authentication to create a category', async () => {
    const response = await request(app).post('/api/categories').send({ nome: 'Calças' });

    expect(response.status).toBe(401);
    expect(categoriaModelMock.create).not.toHaveBeenCalled();
  });

  it('allows admins to create categories with normalized payload', async () => {
    const saved = { _id: '123', nome: 'Calças', slug: 'calcas', descricao: '', subcategorias: [] };
    categoriaModelMock.create.mockResolvedValue(saved);

    const response = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({ nome: 'Calças', subcategorias: 'jeans, sarja' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(saved);
    expect(categoriaModelMock.create).toHaveBeenCalledWith({
      nome: 'Calças',
      slug: 'calcas',
      descricao: '',
      image: '',
      subcategorias: ['jeans', 'sarja'],
    });
  });

  it('updates categories with normalization when admin is authenticated', async () => {
    const updated = { _id: '123', nome: 'Acessórios' };
    categoriaModelMock.findByIdAndUpdate.mockResolvedValue(updated);

    const response = await request(app)
      .put('/api/categories/123')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        nome: 'Acessórios',
        descricao: 'Itens extras',
        subcategorias: 'lenços,  chapéus ',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updated);
    expect(categoriaModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      {
        nome: 'Acessórios',
        slug: 'acessorios',
        descricao: 'Itens extras',
        image: '',
        subcategorias: ['lenços', 'chapéus'],
      },
      { new: true, runValidators: true },
    );
  });

  it('deletes categories when admin is authenticated', async () => {
    categoriaModelMock.findByIdAndDelete.mockResolvedValue({ _id: '123' });

    const response = await request(app)
      .delete('/api/categories/123')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
    expect(categoriaModelMock.findByIdAndDelete).toHaveBeenCalledWith('123');
  });
});


