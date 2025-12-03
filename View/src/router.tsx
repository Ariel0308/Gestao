import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CategoryListPage from './pages/CategoryListPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'categoria/:slug', element: <CategoryListPage /> },
      { path: 'produto/:id', element: <ProductPage /> },
    ],
  },
]);

export default router;
