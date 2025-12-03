import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './Routers/authRouter.js';
import categoryRoutes from './Routers/categoryRouter.js';
import productRoutes from './Routers/productRouter.js';

const mongoUri = process.env.MONGODB_URI ?? 'mongodb+srv://arielsadetsky_db_user:5wzPwmsbNkTmMfqT@cluster0.hs96ai5.mongodb.net/?appName=Cluster0';

mongoose.connect(mongoUri)
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.log('Erro de conexão:', err));

const app = express();
const port = process.env.PORT || 5000;

// Middleware para parsear o corpo da requisição em JSON
app.use(express.json());

// Usar as rotas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
