import express from 'express';
import cors from 'cors';
import authRoutes from './Routers/authRouter.js';
import categoryRoutes from './Routers/categoryRouter.js';
import productRoutes from './Routers/productRouter.js';
import accessoryRoutes from './Routers/accessoryRouter.js';
import movementRoutes from './Routers/movementRouter.js';
import reportRoutes from './Routers/reportRouter.js';
import purchaseRoutes from './Routers/purchaseRouter.js';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/accessories', accessoryRoutes);
  app.use('/api/movements', movementRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/purchase', purchaseRoutes);

  app.get('/', (_req, res) => {
    res.send('Servidor Express funcionando!');
  });

  return app;
};

const app = createApp();

export default app;


