import mongoose from 'mongoose';

// Importação dos modelos
import Categoria from './Models/Categoria.js';
import Produto from './Models/Produto.js';
import User from './Models/User.js';
import Movimento from './Models/Movimento.js';

// Conexão com banco
mongoose.connect('mongodb://localhost:27017/seu_banco')
  .then(() => console.log("MongoDB conectado!"))
  .catch(err => console.error("Erro ao conectar no MongoDB:", err));

const popularBanco = async () => {
  try {
    // Limpando coleções (opcional)
    await Categoria.deleteMany({});
    await Produto.deleteMany({});
    await User.deleteMany({});
    await Movimento.deleteMany({});

    // Criando categorias
    const catEletronicos = await Categoria.create({ nome: "Eletrônicos" });
    const catRoupas = await Categoria.create({ nome: "Roupas" });

    // Criando usuários
    const user1 = await User.create({
      nome: "João",
      email: "joao@exemplo.com",
      senha: "123456"
    });

    const user2 = await User.create({
      nome: "Maria",
      email: "maria@exemplo.com",
      senha: "abcdef"
    });

    // Criando produtos
    const prodCelular = await Produto.create({
      nome: "Smartphone",
      descricao: "Aparelho celular moderno",
      tamanho: "6.5 polegadas",
      cor: "Preto",
      preco: 1500,
      estoque: 10,
      image_url: "https://exemplo.com/celular.jpg",
      id_categoria: catEletronicos._id
    });

    const prodCamiseta = await Produto.create({
      nome: "Camiseta",
      descricao: "Camiseta 100% algodão",
      tamanho: "M",
      cor: "Branca",
      preco: 50,
      estoque: 100,
      image_url: "https://exemplo.com/camiseta.jpg",
      id_categoria: catRoupas._id
    });

    // Criando movimentos (entrada e saída)
    await Movimento.create({
      tipo: "Entrada",
      quantidade: 5,
      valor_unitario: 1500,
      observacao: "Reposição de estoque",
      id_produto: prodCelular._id,
      id_user: user1._id
    });

    await Movimento.create({
      tipo: "Saida",
      quantidade: 2,
      valor_unitario: 50,
      observacao: "Venda no balcão",
      id_produto: prodCamiseta._id,
      id_user: user2._id
    });

    console.log('Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco:', error);
  } finally {
    mongoose.connection.close();
  }
};

popularBanco();
