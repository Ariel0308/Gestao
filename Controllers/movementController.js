import Movimento from '../Models/Movimento.js';
import Produto from '../Models/Produto.js';
import User from '../Models/User.js';

const parseDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const listMovements = async (req, res) => {
  try {
    const query = {};

    if (req.query.tipo) {
      query.tipo = req.query.tipo;
    }

    if (req.query.produto) {
      query.id_produto = req.query.produto;
    }

    if (req.query.usuario) {
      query.id_user = req.query.usuario;
    }

    const from = parseDate(req.query.from);
    const to = parseDate(req.query.to);
    if (from || to) {
      query.data_mov = {};
      if (from) query.data_mov.$gte = from;
      if (to) query.data_mov.$lte = to;
    }

    const movements = await Movimento.find(query)
      .sort({ data_mov: -1 })
      .populate('id_produto')
      .populate('id_user')
      .populate('acessorios');

    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar movimentos', error: error.message });
  }
};

const validateUser = async (userId) => {
  const exists = await User.exists({ _id: userId });
  if (!exists) {
    throw new Error('Usuário inválido');
  }
};

const adjustStock = async (productId, quantity, tipo) => {
  const product = await Produto.findById(productId);
  if (!product) {
    throw new Error('Produto inválido');
  }

  const delta = tipo === 'Entrada' ? quantity : -quantity;
  const novoEstoque = (product.estoque ?? 0) + delta;

  if (novoEstoque < 0) {
    throw new Error('Estoque insuficiente para a saída solicitada');
  }

  product.estoque = novoEstoque;
  await product.save();

  return product;
};

const createMovement = async (req, res) => {
  try {
    const { tipo, quantidade, valor_unitario, observacao, id_produto, id_user, data_mov, acessorios } = req.body;

    if (!tipo || !quantidade || !valor_unitario || !id_produto || !id_user) {
      return res.status(400).json({ message: 'Campos obrigatórios: tipo, quantidade, valor_unitario, id_produto, id_user' });
    }

    const quantidadeNumero = Number(quantidade);
    const valorNumero = Number(valor_unitario);

    if (!Number.isFinite(quantidadeNumero) || quantidadeNumero <= 0) {
      return res.status(400).json({ message: 'Quantidade inválida' });
    }

    if (!Number.isFinite(valorNumero) || valorNumero < 0) {
      return res.status(400).json({ message: 'Valor unitário inválido' });
    }

    await validateUser(id_user);
    await adjustStock(id_produto, quantidadeNumero, tipo);

    const movement = await Movimento.create({
      tipo,
      quantidade: quantidadeNumero,
      valor_unitario: valorNumero,
      observacao,
      id_produto,
      id_user,
      data_mov: data_mov ? new Date(data_mov) : undefined,
      acessorios: Array.isArray(acessorios) ? acessorios.filter(Boolean) : [],
    });

    res.status(201).json(movement);
  } catch (error) {
    res.status(400).json({ message: error.message ?? 'Erro ao registrar movimento' });
  }
};

export default {
  listMovements,
  createMovement,
};

