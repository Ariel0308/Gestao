import { Link } from 'react-router-dom';

type CategoryPillProps = {
  title: string;
  image: string;
  to: string;
  className?: string;
};

const CategoryPill = ({ title, image, to, className = '' }: CategoryPillProps) => {
  return (
    <div className={`flex flex-col items-center gap-4 text-center ${className}`}>
      <div className="relative h-56 w-56 overflow-hidden rounded-full shadow-2xl shadow-black/40 transition md:h-72 md:w-72 lg:h-80 lg:w-80">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <div className="absolute bottom-2 left-0 w-full text-center text-xl font-semibold">
          {title}
        </div>
      </div>
      <Link
        to={to}
        className="rounded-full bg-purple px-8 py-3 text-sm font-semibold text-offwhite shadow-md shadow-purple/30"
      >
        Veja Mais
      </Link>
    </div>
  );
};

export default CategoryPill;
