import categoryJackets from '../assets/category-jackets.svg';
import categoryPants from '../assets/category-pants.svg';
import categoryShirts from '../assets/category-shirts.svg';
import productPlaceholder from '../assets/product-placeholder.svg';
import type { Category, Product } from './types';

export const categories: Category[] = [
  {
    slug: 'camisetas',
    title: 'Camisetas',
    description: 'Modelos básicos e estampados para combinar com seu dia no campus.',
    image: categoryShirts,
    subcategories: ['Animes', 'Básicas', 'Cinema', 'Brasilidade'],
  },
  {
    slug: 'calcas',
    title: 'Calças',
    description: 'Conforto e versatilidade em cortes atualizados.',
    image: categoryPants,
    subcategories: ['Jogger', 'Jeans', 'Alfaiataria', 'Cargo'],
  },
  {
    slug: 'jaquetas',
    title: 'Jaquetas',
    description: 'Camadas leves para encarar o clima do campus.',
    image: categoryJackets,
    subcategories: ['Corta-vento', 'Moletom', 'Jeans', 'Tech'],
  },
];

const shirtImages = [
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
];

const pantsImages = [
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&q=80',
];

const jacketImages = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=400&q=80',
];

const makeImages = (sources: string[]) =>
  [...sources, productPlaceholder].map((src, idx) => ({
    id: `${idx}`,
    src,
    alt: 'Produto UFSCompras',
  }));

export const products: Product[] = [
  {
    id: 'CAM-001',
    name: 'Camiseta Minimal Roxa',
    price: 89.9,
    category: 'camisetas',
    subcategory: 'Básicas',
    colors: ['roxo', 'branco'],
    sizes: ['XS', 'P', 'M', 'G'],
    description: 'Malha premium com modelagem reta para uso diário.',
    images: makeImages(shirtImages),
  },
  {
    id: 'CAM-002',
    name: 'Camiseta Pocket Laranja',
    price: 79.9,
    category: 'camisetas',
    subcategory: 'Brasilidade',
    colors: ['roxo', 'branco'],
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Bolso frontal e tecido leve para os dias mais quentes.',
    images: makeImages([...shirtImages].reverse()),
  },
  {
    id: 'CAM-003',
    name: 'Camiseta Graphic Vinil',
    price: 99.9,
    category: 'camisetas',
    subcategory: 'Animes',
    colors: ['preto', 'vinho'],
    sizes: ['XS', 'P', 'M', 'G', 'GG'],
    description: 'Estampa exclusiva inspirada em animes clássicos.',
    images: makeImages(shirtImages),
  },
  {
    id: 'CAM-004',
    name: 'Camiseta Branco Pocket',
    price: 69.9,
    category: 'camisetas',
    subcategory: 'Básicas',
    colors: ['branco'],
    sizes: ['P', 'M', 'G'],
    description: 'Modelagem soltinha com bolso discreto.',
    images: makeImages(shirtImages),
  },
  {
    id: 'CAL-001',
    name: 'Calça Jogger Tech',
    price: 149.9,
    category: 'calcas',
    subcategory: 'Jogger',
    colors: ['preto', 'roxo'],
    sizes: ['XS', 'P', 'M', 'G', 'GG'],
    description: 'Tecido tecnológico com ajuste no tornozelo.',
    images: makeImages(pantsImages),
  },
  {
    id: 'CAL-002',
    name: 'Calça Jeans Reta',
    price: 159.9,
    category: 'calcas',
    subcategory: 'Jeans',
    colors: ['preto', 'branco'],
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Lavagem clássica e cintura média para todo dia.',
    images: makeImages(pantsImages),
  },
  {
    id: 'CAL-003',
    name: 'Calça Alfaiataria Casual',
    price: 189.9,
    category: 'calcas',
    subcategory: 'Alfaiataria',
    colors: ['vinho', 'preto'],
    sizes: ['P', 'M', 'G'],
    description: 'Caimento estruturado que combina com qualquer apresentação.',
    images: makeImages(pantsImages),
  },
  {
    id: 'JAQ-001',
    name: 'Jaqueta Corta-Vento Sorocaba',
    price: 219.9,
    category: 'jaquetas',
    subcategory: 'Corta-vento',
    colors: ['roxo', 'preto'],
    sizes: ['XS', 'P', 'M', 'G', 'GG'],
    description: 'Resistente ao vento com interior leve e respirável.',
    images: makeImages(jacketImages),
  },
  {
    id: 'JAQ-002',
    name: 'Jaqueta Moletom Forrada',
    price: 199.9,
    category: 'jaquetas',
    subcategory: 'Moletom',
    colors: ['vinho', 'preto'],
    sizes: ['P', 'M', 'G'],
    description: 'Macia, quentinha e com capuz ajustável.',
    images: makeImages(jacketImages),
  },
  {
    id: 'JAQ-003',
    name: 'Jaqueta Jeans Oversized',
    price: 249.9,
    category: 'jaquetas',
    subcategory: 'Jeans',
    colors: ['branco', 'preto'],
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Lavagem média com forro removível.',
    images: makeImages(jacketImages),
  },
];
