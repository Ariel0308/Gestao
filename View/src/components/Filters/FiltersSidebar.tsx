import clsx from 'clsx';
import { COLOR_TOKENS, SIZE_ORDER, type Color, type Size } from '../../services/types';

type FiltersSidebarProps = {
  subcategories: string[];
  selectedSubcategory?: string;
  onSubcategoryChange: (value?: string) => void;
  selectedColors: Color[];
  onColorToggle: (color: Color) => void;
  selectedSizes: Size[];
  onSizeToggle: (size: Size) => void;
  priceMin?: number;
  priceMax?: number;
  onPriceRangeChange: (range: { min?: number; max?: number }) => void;
  onClear: () => void;
};

const FiltersSidebar = ({
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  selectedColors,
  onColorToggle,
  selectedSizes,
  onSizeToggle,
  priceMin,
  priceMax,
  onPriceRangeChange,
  onClear,
}: FiltersSidebarProps) => {
  return (
    <aside className="rounded-2xl bg-[#1f1c25] p-5 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtrar por</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-offwhite/60 underline-offset-4 hover:text-offwhite"
        >
          Limpar
        </button>
      </div>

      <div className="mt-6 space-y-6 text-sm">
        <div>
          <p className="text-xs uppercase tracking-widest text-offwhite/50">Categorias</p>
          <div className="mt-3 flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="subcategory"
                className="accent-purple"
                checked={!selectedSubcategory}
                onChange={() => onSubcategoryChange(undefined)}
              />
              Todas
            </label>
            {subcategories.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="subcategory"
                  className="accent-purple"
                  checked={selectedSubcategory === item}
                  onChange={() => onSubcategoryChange(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-offwhite/50">Cor</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {COLOR_TOKENS.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.label}
                onClick={() => onColorToggle(color.value as Color)}
                className={clsx(
                  'h-8 w-8 rounded-full border-2 border-transparent transition',
                  selectedColors.includes(color.value as Color)
                    ? 'ring-2 ring-offwhite'
                    : 'border-offwhite/30'
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-offwhite/50">Tamanho</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SIZE_ORDER.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeToggle(size)}
                className={clsx(
                  'rounded-full border px-3 py-1 text-xs font-semibold uppercase transition',
                  selectedSizes.includes(size)
                    ? 'border-purple bg-purple text-offwhite'
                    : 'border-offwhite/30 text-offwhite/70'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-offwhite/50">Preço</p>
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              min={0}
              placeholder="De"
              value={priceMin ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                onPriceRangeChange({ min: value === '' ? undefined : Number(value), max: priceMax });
              }}
              className="w-full rounded-2xl border border-offwhite/20 bg-dark px-3 py-2 text-offwhite focus:border-purple focus:outline-none"
            />
            <input
              type="number"
              min={0}
              placeholder="Até"
              value={priceMax ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                onPriceRangeChange({ min: priceMin, max: value === '' ? undefined : Number(value) });
              }}
              className="w-full rounded-2xl border border-offwhite/20 bg-dark px-3 py-2 text-offwhite focus:border-purple focus:outline-none"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
