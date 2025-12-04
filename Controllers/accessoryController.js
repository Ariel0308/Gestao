import Acessorio from '../Models/Acessorio.js';
import Categoria from '../Models/Categoria.js';

const sanitizeArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const listAccessories = async (req, res) => {
  try {
    const query = {};
    const ativoParam = req.query.ativo;
    if (ativoParam === undefined) {
      query.ativo = true;
    } else {
      const normalizedAtivo = String(ativoParam).toLowerCase();
      if (normalizedAtivo !== 'all') {
        // keep filtering unless caller explicitly asks for "all"
        query.ativo = ['true', '1'].includes(normalizedAtivo);
      }
    }

    if (req.query.category) {
      query.categorias = req.query.category;
    }

    const accessories = await Acessorio.find(query).populate('categorias').sort({ nome: 1 });
    res.status(200).json(accessories);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar acessórios', error: error.message });
  }
};

const getAccessory = async (req, res) => {
  try {
    const accessory = await Acessorio.findById(req.params.id).populate('categorias');
    if (!accessory) {
      return res.status(404).json({ message: 'Acessório não encontrado' });
    }
    res.status(200).json(accessory);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar acessório', error: error.message });
  }
};

const validateCategories = async (categoryIds) => {
  if (!categoryIds?.length) return;
  const found = await Categoria.countDocuments({ _id: { $in: categoryIds } });
  if (found !== categoryIds.length) {
    throw new Error('Algumas categorias são inválidas');
  }
};

const createAccessory = async (req, res) => {
  try {
    const payload = {
      nome: req.body.nome,
      descricao: req.body.descricao,
      preco: req.body.preco,
      images: sanitizeArray(req.body.images),
      ativo: req.body.ativo !== undefined ? Boolean(req.body.ativo) : true,
      categorias: sanitizeArray(req.body.categorias),
    };

    if (!payload.nome || payload.preco === undefined) {
      return res.status(400).json({ message: 'Nome e preço são obrigatórios' });
    }

    await validateCategories(payload.categorias);

    const accessory = await Acessorio.create(payload);
    res.status(201).json(accessory);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar acessório', error: error.message });
  }
};

const updateAccessory = async (req, res) => {
  try {
    const payload = {};
    if (req.body.nome !== undefined) payload.nome = req.body.nome;
    if (req.body.descricao !== undefined) payload.descricao = req.body.descricao;
    if (req.body.preco !== undefined) payload.preco = req.body.preco;
    if (req.body.images !== undefined) payload.images = sanitizeArray(req.body.images);
    if (req.body.ativo !== undefined) payload.ativo = Boolean(req.body.ativo);
    if (req.body.categorias !== undefined) payload.categorias = sanitizeArray(req.body.categorias);

    if (payload.categorias) {
      await validateCategories(payload.categorias);
    }

    const accessory = await Acessorio.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!accessory) {
      return res.status(404).json({ message: 'Acessório não encontrado' });
    }

    res.status(200).json(accessory);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar acessório', error: error.message });
  }
};

const deleteAccessory = async (req, res) => {
  try {
    const accessory = await Acessorio.findByIdAndDelete(req.params.id);
    if (!accessory) {
      return res.status(404).json({ message: 'Acessório não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover acessório', error: error.message });
  }
};

export default {
  listAccessories,
  getAccessory,
  createAccessory,
  updateAccessory,
  deleteAccessory,
};

