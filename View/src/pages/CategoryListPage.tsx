import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import FiltersSidebar from '../components/Filters/FiltersSidebar';
import ProductCard from '../components/ProductCard';
import { getCategoryBySlug, getProducts } from '../services/api';
import { COLOR_TOKENS, SIZE_ORDER, type Color, type Size } from '../services/types';

type FiltersState = {
  subcategory?: string;
  colors: Color[];
  sizes: Size[];
  priceMin?: number;
  priceMax?: number;
};

const colorValues = COLOR_TOKENS.map((color) => color.value as Color);

const parseNumber = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseList = <T extends string>(value: string | null, allowed: readonly T[]): T[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is T => allowed.includes(item as T));
};

const parseFiltersFromParams = (params: URLSearchParams): FiltersState => ({
  subcategory: params.get('subcategoria') || undefined,
  colors: parseList(params.get('cores'), colorValues),
  sizes: parseList(params.get('tamanhos'), SIZE_ORDER),
  priceMin: parseNumber(params.get('precoMin')),
  priceMax: parseNumber(params.get('precoMax')),
});

const CategoryListPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<FiltersState>(() =>
    typeof window === 'undefined'
      ? { subcategory: undefined, colors: [], sizes: [], priceMin: undefined, priceMax: undefined }
      : parseFiltersFromParams(new URLSearchParams(window.location.search)),
  );
  const [sort, setSort] = useState<'price-asc' | 'price-desc'>('price-asc');

  const category = useMemo(() => (slug ? getCategoryBySlug(slug) : undefined), [slug]);

  useEffect(() => {
    if (!category) return;
    setFilters((prev) => {
      if (prev.subcategory && !category.subcategories.includes(prev.subcategory)) {
        return { ...prev, subcategory: undefined };
      }
      return prev;
    });
  }, [category]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.subcategory) params.set('subcategoria', filters.subcategory);
    if (filters.colors.length) params.set('cores', filters.colors.join(','));
    if (filters.sizes.length) params.set('tamanhos', filters.sizes.join(','));
    if (typeof filters.priceMin === 'number') params.set('precoMin', String(filters.priceMin));
    if (typeof filters.priceMax === 'number') params.set('precoMax', String(filters.priceMax));
    params.set('ordem', sort);
    setSearchParams(params, { replace: true });
  }, [filters, sort, setSearchParams]);

  useEffect(() => {
    if (!slug) return;
    setFilters({ subcategory: undefined, colors: [], sizes: [], priceMin: undefined, priceMax: undefined });
    setSort('price-asc');
  }, [slug]);

  const products = useMemo(() => {
    if (!slug) return [];
    return getProducts({
      category: slug,
      subcategory: filters.subcategory,
      colors: filters.colors,
      sizes: filters.sizes,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      sort,
    });
  }, [slug, filters, sort]);

  if (!category) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <p className="text-lg font-semibold text-offwhite/70">Categoria não encontrada.</p>
      </div>
    );
  }

  const handleColorToggle = (color: Color) => {
    setFilters((prev) => {
      const exists = prev.colors.includes(color);
      return { ...prev, colors: exists ? prev.colors.filter((c) => c !== color) : [...prev.colors, color] };
    });
  };

  const handleSizeToggle = (size: Size) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(size);
      return { ...prev, sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size] };
    });
  };

  const handlePriceRangeChange = (range: { min?: number; max?: number }) => {
    setFilters((prev) => ({ ...prev, priceMin: range.min, priceMax: range.max }));
  };

  const handleClear = () => {
    setFilters({ subcategory: undefined, colors: [], sizes: [], priceMin: undefined, priceMax: undefined });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2 text-center md:text-left">
        <p className="text-sm uppercase tracking-[0.3em] text-offwhite/60">{category.title}</p>
        <h1 className="text-3xl font-bold">{category.title}</h1>
        <p className="text-offwhite/70">{category.description}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
        <FiltersSidebar
          subcategories={category.subcategories}
          selectedSubcategory={filters.subcategory}
          onSubcategoryChange={(value) => setFilters((prev) => ({ ...prev, subcategory: value }))}
          selectedColors={filters.colors}
          onColorToggle={handleColorToggle}
          selectedSizes={filters.sizes}
          onSizeToggle={handleSizeToggle}
          priceMin={filters.priceMin}
          priceMax={filters.priceMax}
          onPriceRangeChange={handlePriceRangeChange}
          onClear={handleClear}
        />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-offwhite/70">
              {products.length} produto{products.length === 1 ? '' : 's'}
            </p>
            <label className="flex items-center gap-3 text-sm">
              <span className="text-offwhite/70">Ordenar por</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as 'price-asc' | 'price-desc')}
                className="rounded-full border border-offwhite/20 bg-dark px-4 py-2 text-offwhite focus:border-purple focus:outline-none"
              >
                <option value="price-asc">Preço: menor ao maior</option>
                <option value="price-desc">Preço: maior ao menor</option>
              </select>
            </label>
          </div>

          {products.length === 0 ? (
            <div className="rounded-3xl bg-[#1f1c25] p-8 text-center text-offwhite/70">
              Nenhum produto encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryListPage;
