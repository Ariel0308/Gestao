import { Link } from 'react-router-dom';
import type { Product } from '../services/types';

type ProductCardProps = {
  product: Product;
};

const formatPrice = (price: number) =>
  price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

const ProductCard = ({ product }: ProductCardProps) => {
  const cover = product.images[0];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-[#1f1c25] text-left shadow-xl shadow-black/20">
      <div className="relative aspect-[3/4]">
        {cover ? (
          <img src={cover.src} alt={cover.alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-offwhite/50">
            Sem imagem
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-offwhite/50">{product.subcategory}</p>
        <h3 className="text-base font-semibold leading-tight">{product.name}</h3>
        <p className="text-lg font-bold text-orange">{formatPrice(product.price)}</p>
        <Link
          to={`/produto/${product.id}`}
          className="mt-auto inline-flex items-center justify-center rounded-full border border-offwhite/30 px-4 py-2 text-sm font-semibold text-offwhite transition hover:border-offwhite"
        >
          Ver produto
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
