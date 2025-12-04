import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    descricao: { type: String, default: '' },
    image: { type: String, default: '' },
    subcategorias: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
);

categoriaSchema.index({ slug: 1 });

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;