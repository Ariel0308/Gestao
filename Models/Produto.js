import mongoose from 'mongoose';
import Categoria from './Categoria.js'; // Referência à coleção Categoria

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  tamanho: { type: String },
  cor: { type: String },
  preco: { type: Number, required: true, min: 0 },
  estoque: { type: Number, default: 0, min: 0 },
  image_url: { type: String, required: true },
  
  id_categoria: { 
    type: mongoose.Schema.Types.ObjectId, // Tipo de dado para referência
    ref: 'Categoria',  // Referência para a coleção Categoria
    required: true
  }
});

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;