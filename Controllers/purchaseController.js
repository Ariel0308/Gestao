import Produto from '../Models/Produto.js';
import Movimento from '../Models/Movimento.js';

const adjustStockForSale = async (productId, quantity) => {
  const product = await Produto.findById(productId);
  if (!product) {
    throw new Error('Produto inválido');
  }
  const novoEstoque = (product.estoque ?? 0) - quantity;
  if (novoEstoque < 0) {
    throw new Error('Estoque insuficiente');
  }
  product.estoque = novoEstoque;
  await product.save();
  return product;
};

const createPurchase = async (req, res) => {
  try {
    const { productId, quantity, accessories } = req.body;
    const userId = req.user?.sub;

    const qnt = Number(quantity);
    if (!userId) return res.status(401).json({ message: 'Não autenticado' });
    if (!productId || !Number.isFinite(qnt) || qnt <= 0) {
      return res.status(400).json({ message: 'productId e quantity são obrigatórios' });
    }

    const product = await adjustStockForSale(productId, qnt);

    await Movimento.create({
      tipo: 'Saida',
      quantidade: qnt,
      valor_unitario: product.preco,
      observacao: 'Compra do site',
      id_produto: product._id,
      id_user: userId,
      acessorios: Array.isArray(accessories) ? accessories.filter(Boolean) : [],
    });

    res.status(201).json({ message: 'Compra registrada', estoque: product.estoque });
  } catch (error) {
    res.status(400).json({ message: error.message ?? 'Erro ao processar compra' });
  }
};

export default { createPurchase };

