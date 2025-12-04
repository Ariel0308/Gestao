import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import Categoria from './Models/Categoria.js';
import Produto from './Models/Produto.js';
import User from './Models/User.js';
import Movimento from './Models/Movimento.js';
import Acessorio from './Models/Acessorio.js';

const defaultMongoUri = 'mongodb://gestao_root:gestao_secret@localhost:27017/gestao?authSource=admin';
const mongoUri = process.env.MONGODB_URI ?? defaultMongoUri;

const categorySeeds = [
  {
    nome: 'Camisetas',
    slug: 'camisetas',
    descricao: 'Modelos básicos e estampados para qualquer ocasião no campus.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    subcategorias: ['Animes', 'Básicas', 'Cinema', 'Brasilidade'],
  },
  {
    nome: 'Calças',
    slug: 'calcas',
    descricao: 'Conforto e versatilidade em cortes atualizados.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
    subcategorias: ['Jogger', 'Jeans', 'Alfaiataria', 'Cargo'],
  },
  {
    nome: 'Blusas',
    slug: 'blusas',
    descricao: 'Camadas confortáveis para encarar o clima do campus.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    subcategorias: ['Moletom', 'Cropped', 'Cardigan', 'Básicas'],
  },
];

const buildUserSeeds = async () => [
  {
    nome: 'Admin UFS',
    email: 'admin@ufscompras.com',
    senha: await bcrypt.hash('admin123', 10),
    isAdmin: true,
  },
  {
    nome: 'João Souza',
    email: 'joao@example.com',
    senha: await bcrypt.hash('123456', 10),
  },
];

const buildProductSeeds = (categoriaBySlug) => [
  {
    nome: 'Camiseta Minimal Roxa',
    descricao: 'Malha premium com modelagem reta para uso diário.',
    tamanhos: ['P', 'M', 'G'],
    cores: ['roxo', 'branco'],
    preco: 89.9,
    estoque: 50,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1521572265474-bd1f4b8747b9?auto=format&fit=crop&w=400&q=80',
    ],
    isFeatured: true,
    id_categoria: categoriaBySlug.camisetas._id,
  },
  {
    nome: 'Camiseta Graphic Vinil',
    descricao: 'Estampa exclusiva inspirada em animes clássicos.',
    tamanhos: ['M', 'G', 'GG'],
    cores: ['preto', 'branco'],
    preco: 99.9,
    estoque: 30,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    ],
    isFeatured: false,
    id_categoria: categoriaBySlug.camisetas._id,
  },
  {
    nome: 'Calça Jogger Tech',
    descricao: 'Tecido tecnológico com ajuste no tornozelo.',
    tamanhos: ['P', 'M', 'G', 'GG'],
    cores: ['preto', 'roxo'],
    preco: 149.9,
    estoque: 35,
    images: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&q=80',
    ],
    isFeatured: true,
    id_categoria: categoriaBySlug.calcas._id,
  },
  {
    nome: 'Blusa Moletom Forrada',
    descricao: 'Interior felpado com caimento confortável.',
    tamanhos: ['P', 'M', 'G'],
    cores: ['vinho', 'preto'],
    preco: 199.9,
    estoque: 20,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=400&q=80',
    ],
    isFeatured: false,
    id_categoria: categoriaBySlug.blusas._id,
  },
];

const buildAccessorySeeds = (categoriaBySlug) => [
  {
    nome: 'Boné Bordado UFS',
    descricao: 'Boné estruturado com ajuste traseiro.',
    preco: 69.9,
    images: ['https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&q=80'],
    categorias: [categoriaBySlug.camisetas._id],
  },
  {
    nome: 'Mochila Minimal',
    descricao: 'Compartimento para notebook e acabamento resistente à água.',
    preco: 189.9,
    images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80'],
    categorias: [categoriaBySlug.calcas._id, categoriaBySlug.blusas._id],
  },
  {
    nome: 'Gorro Roxo',
    descricao: 'Tricotado com fio acrílico macio.',
    preco: 49.9,
    images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80'],
    categorias: [categoriaBySlug.blusas._id],
  },
];

const buildMovimentoSeeds = (produtos, usuarios, acessorios) => [
  {
    tipo: 'Entrada',
    quantidade: 20,
    valor_unitario: 89.9,
    observacao: 'Compra de fornecedor',
    id_produto: produtos.find((p) => p.nome === 'Camiseta Minimal Roxa')._id,
    id_user: usuarios[0]._id,
  },
  {
    tipo: 'Saida',
    quantidade: 4,
    valor_unitario: 149.9,
    observacao: 'Venda online (com acessórios)',
    id_produto: produtos.find((p) => p.nome === 'Calça Jogger Tech')._id,
    id_user: usuarios[0]._id,
    acessorios: [
      acessorios.find((a) => a.nome === 'Boné Bordado UFS')._id,
      acessorios.find((a) => a.nome === 'Mochila Minimal')._id,
    ],
  },
  {
    tipo: 'Saida',
    quantidade: 3,
    valor_unitario: 99.9,
    observacao: 'Venda presencial',
    id_produto: produtos.find((p) => p.nome === 'Camiseta Graphic Vinil')._id,
    id_user: usuarios[1]._id,
  },
];

const popularBanco = async () => {
  try {
    console.log(`Conectando ao MongoDB (${mongoUri})...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB conectado!');

    console.log('Limpando coleções...');
    await Promise.all([
      Categoria.deleteMany({}),
      Produto.deleteMany({}),
      User.deleteMany({}),
      Movimento.deleteMany({}),
      Acessorio.deleteMany({}),
    ]);

    console.log('Inserindo categorias...');
    const categorias = await Categoria.insertMany(categorySeeds);
    const categoriaBySlug = Object.fromEntries(categorias.map((categoria) => [categoria.slug, categoria]));

    console.log('Inserindo usuários...');
    const usuarios = await User.insertMany(await buildUserSeeds());

    console.log('Inserindo produtos...');
    const produtos = await Produto.insertMany(buildProductSeeds(categoriaBySlug));

  console.log('Inserindo acessórios...');
  const acessorios = await Acessorio.insertMany(buildAccessorySeeds(categoriaBySlug));

  console.log('Inserindo movimentos...');
  await Movimento.insertMany(buildMovimentoSeeds(produtos, usuarios, acessorios));

    console.log('Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Conexão com MongoDB encerrada.');
  }
};

popularBanco();