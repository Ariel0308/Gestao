import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './Routers/authRouter.js';
import categoryRoutes from './Routers/categoryRouter.js';
import productRoutes from './Routers/productRouter.js';
import accessoryRoutes from './Routers/accessoryRouter.js';
import movementRoutes from './Routers/movementRouter.js';
import reportRoutes from './Routers/reportRouter.js';
import purchaseRoutes from './Routers/purchaseRouter.js';

const defaultMongoUri = 'mongodb://gestao_root:gestao_secret@localhost:27017/gestao?authSource=admin';
const mongoUri = process.env.MONGODB_URI ?? defaultMongoUri;

mongoose.connect(mongoUri)
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.log('Erro de conexão:', err));

const app = express();
const port = process.env.PORT || 5000;

// Middleware para parsear o corpo da requisição em JSON
app.use(express.json());
app.use(cors());

// Usar as rotas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/accessories', accessoryRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/purchase', purchaseRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
