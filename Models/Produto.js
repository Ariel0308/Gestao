import mongoose from 'mongoose';
import Categoria from './Categoria.js'; // Referência à coleção Categoria

const produtoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true },
    tamanhos: {
      type: [String],
      default: [],
    },
    cores: {
      type: [String],
      default: [],
    },
    preco: { type: Number, required: true, min: 0 },
    estoque: { type: Number, default: 0, min: 0 },
    images: {
      type: [String],
      default: [],
    },
    isFeatured: { type: Boolean, default: false },

    id_categoria: {
      type: mongoose.Schema.Types.ObjectId, // Tipo de dado para referência
      ref: 'Categoria', // Referência para a coleção Categoria
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

produtoSchema.index({ isFeatured: 1 });
produtoSchema.index({ id_categoria: 1 });

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;