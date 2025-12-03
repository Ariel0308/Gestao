import 'dotenv/config';
import mongoose from 'mongoose';

import Categoria from './Models/Categoria.js';
import Produto from './Models/Produto.js';
import User from './Models/User.js';
import Movimento from './Models/Movimento.js';

const defaultMongoUri = 'mongodb://gestao_root:gestao_secret@localhost:27017/gestao?authSource=admin';
const mongoUri = process.env.MONGODB_URI ?? defaultMongoUri;

const categorySeeds = [
  { nome: 'Camisetas' },
  { nome: 'Calças' },
  { nome: 'Jaquetas' },
];

const userSeeds = [
  { nome: 'João Souza', email: 'joao@example.com', senha: '123456' },
  { nome: 'Maria Lima', email: 'maria@example.com', senha: 'abcdef' },
];

const buildProductSeeds = (categoriaByNome) => [
  {
    nome: 'Camiseta Minimal Roxa',
    descricao: 'Malha premium com modelagem reta para uso diário.',
    tamanho: 'M',
    cor: 'Roxo',
    preco: 89.9,
    estoque: 50,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    id_categoria: categoriaByNome['Camisetas']._id,
  },
  {
    nome: 'Calça Jogger Tech',
    descricao: 'Tecido tecnológico com ajuste no tornozelo.',
    tamanho: 'G',
    cor: 'Preto',
    preco: 149.9,
    estoque: 30,
    image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
    id_categoria: categoriaByNome['Calças']._id,
  },
  {
    nome: 'Jaqueta Corta-Vento Sorocaba',
    descricao: 'Resistente ao vento com interior leve e respirável.',
    tamanho: 'P',
    cor: 'Roxo',
    preco: 219.9,
    estoque: 20,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    id_categoria: categoriaByNome['Jaquetas']._id,
  },
  {
    nome: 'Camiseta Graphic Vinil',
    descricao: 'Estampa exclusiva inspirada em animes clássicos.',
    tamanho: 'G',
    cor: 'Preto',
    preco: 99.9,
    estoque: 40,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    id_categoria: categoriaByNome['Camisetas']._id,
  },
];

const buildMovimentoSeeds = (produtos, usuarios) => [
  {
    tipo: 'Entrada',
    quantidade: 10,
    valor_unitario: 89.9,
    observacao: 'Compra de fornecedor',
    id_produto: produtos.find((p) => p.nome === 'Camiseta Minimal Roxa')._id,
    id_user: usuarios[0]._id,
  },
  {
    tipo: 'Saida',
    quantidade: 2,
    valor_unitario: 149.9,
    observacao: 'Venda online',
    id_produto: produtos.find((p) => p.nome === 'Calça Jogger Tech')._id,
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
    ]);

    console.log('Inserindo categorias...');
    const categorias = await Categoria.insertMany(categorySeeds);
    const categoriaByNome = Object.fromEntries(
      categorias.map((categoria) => [categoria.nome, categoria])
    );

    console.log('Inserindo usuários...');
    const usuarios = await User.insertMany(userSeeds);

    console.log('Inserindo produtos...');
    const produtos = await Produto.insertMany(buildProductSeeds(categoriaByNome));

    console.log('Inserindo movimentos...');
    await Movimento.insertMany(buildMovimentoSeeds(produtos, usuarios));

    console.log('Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Conexão com MongoDB encerrada.');
  }
};

popularBanco();