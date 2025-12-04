import mongoose from 'mongoose';
import Produto from '../Models/Produto.js';
import Categoria from '../Models/Categoria.js';

const parseNumber = (value, fallback) => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'on'].includes(String(value).toLowerCase());
};

const parseBooleanFlag = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'on', 'yes'].includes(String(value).toLowerCase());
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const sanitizeStringArray = (value, { lowercase = false } = {}) =>
  toArray(value).map((item) => (lowercase ? item.toLowerCase() : item));

const buildSort = (sortParam) => {
  switch (sortParam) {
    case 'price-asc':
      return { preco: 1 };
    case 'price-desc':
      return { preco: -1 };
    case 'name-asc':
      return { nome: 1 };
    case 'name-desc':
      return { nome: -1 };
    default:
      return { createdAt: -1 };
  }
};

const resolveCategoryId = async (categoryParam) => {
  if (!categoryParam) return undefined;
  if (mongoose.Types.ObjectId.isValid(categoryParam)) return categoryParam;

  const category = await Categoria.findOne({ slug: categoryParam });
  return category?._id;
};

const buildProductPayload = (body, { partial = false } = {}) => {
  const payload = {};

  const assign = (field, value) => {
    if (value === undefined && partial) return;
    payload[field] = value;
  };

  assign('nome', body.nome);
  assign('descricao', body.descricao);
  assign('tamanhos', sanitizeStringArray(body.tamanhos));
  assign('cores', sanitizeStringArray(body.cores, { lowercase: true }));
  assign('preco', body.preco !== undefined ? Number(body.preco) : undefined);
  assign('estoque', body.estoque !== undefined ? Number(body.estoque) : undefined);
  assign('images', sanitizeStringArray(body.images));
  assign('isFeatured', parseBoolean(body.isFeatured, false));
  assign('id_categoria', body.id_categoria);

  return payload;
};

const queryProducts = async ({ filters = {}, page = 1, limit = 12, sort = 'createdAt' }) => {
  const query = {};
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNumber - 1) * limitNumber;

  if (filters.category) {
    const categoryId = await resolveCategoryId(filters.category);
    if (!categoryId) {
      return {
        data: [],
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total: 0,
          totalPages: 0,
        },
      };
    }
    query.id_categoria = categoryId;
  }

  if (filters.colors?.length) {
    query.cores = { $in: filters.colors };
  }

  if (filters.sizes?.length) {
    query.tamanhos = { $in: filters.sizes };
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    query.preco = {};
    if (filters.priceMin !== undefined) query.preco.$gte = filters.priceMin;
    if (filters.priceMax !== undefined) query.preco.$lte = filters.priceMax;
  }

  if (filters.search) {
    query.nome = { $regex: filters.search, $options: 'i' };
  }

  if (filters.isFeatured !== undefined) {
    query.isFeatured = filters.isFeatured;
  }

  const [items, total] = await Promise.all([
    Produto.find(query)
      .sort(buildSort(sort))
      .skip(skip)
      .limit(limitNumber)
      .populate('id_categoria'),
    Produto.countDocuments(query),
  ]);

  return {
    data: items,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const listProducts = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      colors: sanitizeStringArray(req.query.colors, { lowercase: true }),
      sizes: sanitizeStringArray(req.query.sizes),
      priceMin: parseNumber(req.query.priceMin),
      priceMax: parseNumber(req.query.priceMax),
      search: req.query.search,
      isFeatured: parseBooleanFlag(req.query.featured),
    };

    const result = await queryProducts({
      filters,
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar produtos', error: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const result = await queryProducts({
      filters: {
        category: req.params.categoryId,
        colors: sanitizeStringArray(req.query.colors, { lowercase: true }),
        sizes: sanitizeStringArray(req.query.sizes),
        priceMin: parseNumber(req.query.priceMin),
        priceMax: parseNumber(req.query.priceMax),
        search: req.query.search,
      },
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar produtos da categoria', error: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseNumber(req.query.limit, 8);
    const products = await Produto.find({ isFeatured: true })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('id_categoria');

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar destaques', error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Produto.findById(req.params.id).populate('id_categoria');
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
};

const validateCategoryOrFail = async (categoryId) => {
  if (!categoryId) {
    throw new Error('Categoria é obrigatória');
  }

  const exists = await Categoria.exists({ _id: categoryId });
  if (!exists) {
    throw new Error('Categoria inválida');
  }
};

const createProduct = async (req, res) => {
  try {
    const payload = buildProductPayload(req.body);
    await validateCategoryOrFail(payload.id_categoria);

    const product = await Produto.create(payload);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message ?? 'Erro ao criar produto' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const payload = buildProductPayload(req.body, { partial: true });
    if (payload.id_categoria) {
      await validateCategoryOrFail(payload.id_categoria);
    }

    const product = await Produto.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message ?? 'Erro ao atualizar produto' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Produto.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover produto', error: error.message });
  }
};

export default {
  listProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};