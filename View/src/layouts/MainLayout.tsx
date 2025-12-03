import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-dark text-offwhite">
      <Header />
      <main className="flex-1 bg-dark">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
