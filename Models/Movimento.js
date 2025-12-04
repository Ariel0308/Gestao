import mongoose from 'mongoose';
import Produto from './Produto.js'; // Referência à coleção Produto
import User from './User.js'; // Referência à coleção User

// Definindo os tipos de movimento possíveis
const tipoMovimentoEnum = ['Entrada', 'Saida'];

const movimentoSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: tipoMovimentoEnum, // Validando se o tipo é 'Entrada' ou 'Saida'
      required: true,
    },
    quantidade: {
      type: Number,
      required: true,
      min: 1, // A quantidade deve ser maior que 0
    },
    data_mov: {
      type: Date,
      default: Date.now,
    },
    valor_unitario: {
      type: Number,
      required: true,
      min: 0,
    },
    observacao: {
      type: String,
    },

    id_produto: {
      type: mongoose.Schema.Types.ObjectId, // Referência para o Produto
      ref: 'Produto',
      required: true,
    },

    id_user: {
      type: mongoose.Schema.Types.ObjectId, // Referência para o User
      ref: 'User',
      required: true,
    },
    acessorios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Acessorio',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Movimento = mongoose.model('Movimento', movimentoSchema);

export default Movimento;