import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const defaultMongoUri = 'mongodb://gestao_root:gestao_secret@localhost:27017/gestao?authSource=admin';
const mongoUri = process.env.MONGODB_URI ?? defaultMongoUri;

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log('Erro de conexão:', err));

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

export default app;
