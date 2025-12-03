import { useEffect, useMemo, useState } from 'react';

export type Slide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  image: string;
};

type CarouselProps = {
  slides: Slide[];
  autoPlay?: number;
};

const Carousel = ({ slides, autoPlay = 6000 }: CarouselProps) => {
  const [index, setIndex] = useState(0);
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const hasSlides = safeSlides.length > 0;

  useEffect(() => {
    if (!hasSlides || safeSlides.length === 1) return undefined;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeSlides.length);
    }, autoPlay);

    return () => window.clearInterval(id);
  }, [autoPlay, hasSlides, safeSlides.length]);

  if (!hasSlides) {
    return null;
  }

  const activeSlide = safeSlides[index];

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (safeSlides.length === 1) return;
    setIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % safeSlides.length;
      }
      return prev === 0 ? safeSlides.length - 1 : prev - 1;
    });
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-purple via-purple/80 to-orange text-offwhite">
      <div className="mx-auto flex min-h-[360px] max-w-6xl flex-col gap-10 px-6 py-12 md:min-h-[420px] md:flex-row md:items-center md:px-10">
        <div className="flex-1 space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-offwhite/80">{activeSlide.subtitle}</p>
          <h2 className="text-3xl font-bold md:text-4xl">{activeSlide.title}</h2>
          <p className="text-offwhite/80 md:text-lg">{activeSlide.description}</p>
          <button className="rounded-full bg-offwhite px-5 py-2 text-sm font-semibold text-purple">
            {activeSlide.ctaLabel}
          </button>
        </div>
        <div className="flex flex-1 justify-center">
          <div className="relative flex h-60 w-60 items-center justify-center rounded-full bg-offwhite/90">
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="h-48 w-48 object-cover drop-shadow-2xl"
            />
            <div className="absolute inset-0 rounded-full border-4 border-offwhite/70" />
          </div>
        </div>
      </div>

      {safeSlides.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-offwhite/20 p-2 text-white hover:bg-offwhite/40"
            onClick={() => handleNavigation('prev')}
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-offwhite/20 p-2 text-white hover:bg-offwhite/40"
            onClick={() => handleNavigation('next')}
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {safeSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(idx)}
                className={
                  'h-2 w-6 rounded-full transition-all ' +
                  (idx === index ? 'bg-offwhite' : 'bg-offwhite/40')
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
