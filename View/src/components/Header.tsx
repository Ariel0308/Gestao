import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-dark text-offwhite">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple text-sm font-bold text-offwhite">
            UFS
          </div>
          <span className="text-xl">compras</span>
        </Link>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3 text-sm">
          <button className="rounded-full bg-offwhite/10 px-4 py-2 text-offwhite">
            Nome da pessoa
          </button>
          <Link
            to="/cadastro"
            className="rounded-full bg-purple px-6 py-2 text-sm font-semibold text-offwhite shadow"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
