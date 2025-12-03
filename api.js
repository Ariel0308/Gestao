import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './Routers/authRouter.js';
import categoryRoutes from './Routers/categoryRouter.js';
import productRoutes from './Routers/productRouter.js';

mongoose.connect('mongodb+srv://arielsadetsky_db_user:5wzPwmsbNkTmMfqT@cluster0.hs96ai5.mongodb.net/?appName=Cluster0')
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.log('Erro de conexão:', err));

const app = express();
const port = process.env.PORT || 5000;

// Middleware para parsear o corpo da requisição em JSON
app.use(bodyParser.json());

// Usar as rotas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', produtoRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log('Servidor rodando na porta ${port}');
});