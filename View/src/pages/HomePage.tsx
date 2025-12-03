import Carousel, { type Slide } from '../components/Carousel/Carousel';
import CategoryPill from '../components/CategoryPill';
import categoryJackets from '../assets/category-jackets.svg';
import categoryPants from '../assets/category-pants.svg';
import categoryShirts from '../assets/category-shirts.svg';

const heroSlides: Slide[] = [
  {
    id: 'slide-1',
    subtitle: 'Minimalista & Elegante',
    title: 'Prático, rápido e feito para você.',
    description: 'Coleções selecionadas com o estilo universitário perfeito para qualquer ocasião.',
    ctaLabel: 'Cadastre-se',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'slide-2',
    subtitle: 'Coleções Exclusivas',
    title: 'Looks completos em poucos cliques.',
    description: 'Combine camisetas, calças e jaquetas com curadoria especial para o campus.',
    ctaLabel: 'Ver novidades',
    image:
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&q=80',
  },
];

const featuredCategories = [
  {
    title: 'Camisetas',
    slug: 'camisetas',
    image: categoryShirts,
  },
  {
    title: 'Calças',
    slug: 'calcas',
    image: categoryPants,
  },
  {
    title: 'Jaquetas',
    slug: 'jaquetas',
    image: categoryJackets,
  },
];

const HomePage = () => {
  return (
    <div className="flex flex-col gap-12 pb-10">
      <section className="-mx-4 w-screen max-w-none self-center md:-mx-8">
        <Carousel slides={heroSlides} autoPlay={7000} />
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 text-center">
        <div className="grid grid-cols-1 gap-10 md:block">
          {featuredCategories.map((category, index) => (
            <CategoryPill
              key={category.slug}
              title={category.title}
              image={category.image}
              to={`/categoria/${category.slug}`}
              className={
                index === 0
                  ? 'md:inline-flex md:-mr-12 md:z-30'
                  : index === 1
                  ? 'md:inline-flex md:-ml-12 md:-mr-12 md:z-20'
                  : 'md:inline-flex md:-ml-12 md:z-10'
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
