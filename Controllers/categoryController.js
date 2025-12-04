import Categoria from '../Models/Categoria.js';

const slugify = (value) =>
  value
    ?.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const listCategories = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nome: 1 });
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

const normalizePayload = (body) => {
  const slugValue = slugify(body.slug || body.nome || '');
  return {
    nome: body.nome,
    slug: slugValue,
    descricao: body.descricao ?? '',
    image: body.image ?? '',
    subcategorias: Array.isArray(body.subcategorias)
      ? body.subcategorias
      : typeof body.subcategorias === 'string'
      ? body.subcategorias
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
  };
};

const createCategory = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }

    const categoria = await Categoria.create(normalizePayload(req.body));
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar categoria', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    if (!req.body.nome) {
      delete payload.nome;
    }
    if (!req.body.slug && !req.body.nome) {
      delete payload.slug;
    }

    const categoria = await Categoria.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.status(200).json(categoria);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar categoria', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover categoria', error: error.message });
  }
};

export default { listCategories, getCategory, createCategory, updateCategory, deleteCategory };
