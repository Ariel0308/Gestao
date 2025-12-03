import { categories, products } from './catalog';
import type { Category, Product, ProductFilters } from './types';

const sortByPrice = (list: Product[], sort?: ProductFilters['sort']) => {
  if (!sort) return list;
  return [...list].sort((a, b) => {
    if (sort === 'price-asc') {
      return a.price - b.price;
    }
    return b.price - a.price;
  });
};

export const getCategories = (): Category[] => categories;

export const getCategoryBySlug = (slug: string) => categories.find((category) => category.slug === slug);

export const getProducts = (filters: ProductFilters = {}): Product[] => {
  const { category, subcategory, colors, sizes, priceMin, priceMax, sort } = filters;

  const filtered = products.filter((product) => {
    if (category && product.category !== category) return false;
    if (subcategory && product.subcategory !== subcategory) return false;

    if (colors?.length && !colors.some((color) => product.colors.includes(color))) {
      return false;
    }

    if (sizes?.length && !sizes.some((size) => product.sizes.includes(size))) {
      return false;
    }

    if (typeof priceMin === 'number' && product.price < priceMin) return false;
    if (typeof priceMax === 'number' && product.price > priceMax) return false;

    return true;
  });

  return sortByPrice(filtered, sort);
};

export const getProductById = (id: string) => products.find((product) => product.id === id);
