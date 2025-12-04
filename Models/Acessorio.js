import mongoose from 'mongoose';

const acessorioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true },
    preco: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    ativo: { type: Boolean, default: true },
    categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }],
  },
  {
    timestamps: true,
  },
);

acessorioSchema.index({ ativo: 1 });

const Acessorio = mongoose.model('Acessorio', acessorioSchema);

export default Acessorio;

