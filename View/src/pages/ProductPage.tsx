import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuantityInput from '../components/QuantityInput';
import { getProductById } from '../services/api';
import { COLOR_TOKENS, SIZE_ORDER, type Color, type Size } from '../services/types';

const formatPrice = (price: number) =>
  price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = useMemo(() => (id ? getProductById(id) : undefined), [id]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>();
  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    setSelectedImageIndex(0);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[0]);
    setQuantity(1);
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center">
        <p className="text-lg font-semibold text-offwhite/70">Produto não encontrado.</p>
      </div>
    );
  }

  const images = product.images.length ? product.images : [{ id: 'placeholder', src: '', alt: product.name }];
  const activeImage = images[selectedImageIndex] ?? images[0];

  const availableColorTokens = COLOR_TOKENS.filter((token) =>
    product.colors.includes(token.value as Color),
  );
  const availableSizes = SIZE_ORDER.filter((size) => product.sizes.includes(size));

  const handlePurchase = () => {
    console.log('Comprar produto', {
      id: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[96px,minmax(0,1fr),360px]">
        <div className="flex flex-row gap-3 overflow-x-auto lg:flex-col">
          {images.map((image, index) => (
            <button
              type="button"
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={clsx(
                'aspect-[4/5] w-20 overflow-hidden rounded-xl border transition lg:w-full',
                selectedImageIndex === index ? 'border-purple' : 'border-transparent',
              )}
            >
              {image.src ? (
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-offwhite/50">Imagem</div>
              )}
            </button>
          ))}
        </div>

        <div className="w-full overflow-hidden rounded-2xl bg-[#1f1c25] max-h-[72vh] md:max-h-[70vh] aspect-[4/3] md:aspect-[3/2]">
          {activeImage?.src ? (
            <img src={activeImage.src} alt={activeImage.alt} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-offwhite/40">
              Sem imagem disponível
            </div>
          )}
        </div>

        <aside className="rounded-2xl bg-[#1f1c25] p-5 shadow-xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.4em] text-offwhite/60">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-orange">{formatPrice(product.price)}</p>

          <div className="mt-6 space-y-5 text-sm">
            <div>
              <p className="text-xs uppercase tracking-widest text-offwhite/50">Tamanho</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={clsx(
                      'rounded-full border px-3 py-1 text-xs font-semibold uppercase transition',
                      selectedSize === size
                        ? 'border-purple bg-purple text-offwhite'
                        : 'border-offwhite/30 text-offwhite/70',
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-offwhite/50">Cor</p>
              <div className="mt-3 flex gap-3">
                {availableColorTokens.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value as Color)}
                    className={clsx(
                      'h-9 w-9 rounded-full border-2 border-transparent transition',
                      selectedColor === (color.value as Color) ? 'ring-2 ring-offwhite' : 'border-offwhite/30',
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-offwhite/50">Quantidade</span>
              <QuantityInput value={quantity} onChange={setQuantity} />
            </div>
          </div>

          <button
            type="button"
            onClick={handlePurchase}
            className="mt-8 w-full rounded-full bg-purple py-3 text-center text-sm font-semibold text-offwhite shadow-lg shadow-purple/40 transition hover:brightness-110"
          >
            Comprar
          </button>
        </aside>
      </div>

      <section className="rounded-2xl bg-[#1f1c25] p-6 shadow-inner shadow-black/30">
        <h3 className="text-lg font-semibold">Descrição</h3>
        <p className="mt-2 text-offwhite/70">{product.description}</p>
      </section>
    </div>
  );
};

export default ProductPage;
