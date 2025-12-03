export type ColorToken = {
  value: string;
  label: string;
  hex: string;
};

export type Size = 'XS' | 'P' | 'M' | 'G' | 'GG';
export type Color = 'preto' | 'branco' | 'vinho' | 'roxo';

export type Category = {
  slug: string;
  title: string;
  description: string;
  image: string;
  subcategories: string[];
};

export type ProductImage = {
  id: string;
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  colors: Color[];
  sizes: Size[];
  description: string;
  images: ProductImage[];
};

export type ProductFilters = {
  category?: string;
  subcategory?: string;
  colors?: Color[];
  sizes?: Size[];
  priceMin?: number;
  priceMax?: number;
  sort?: 'price-asc' | 'price-desc';
};

export const SIZE_ORDER: Size[] = ['XS', 'P', 'M', 'G', 'GG'];

export const COLOR_TOKENS: ColorToken[] = [
  { value: 'preto', label: 'Preto', hex: '#1F1B24' },
  { value: 'branco', label: 'Branco', hex: '#F4EEFF' },
  { value: 'vinho', label: 'Vinho', hex: '#5B2333' },
  { value: 'roxo', label: 'Roxo', hex: '#7250C7' },
];
