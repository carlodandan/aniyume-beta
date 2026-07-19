// src/components/Hero.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTitle, getBanner } from '../utils/helpers';

export const Hero = ({ anime }) => {
  // Normalize to array – if `anime` is a single object, wrap it
  const slides = Array.isArray(anime) ? anime : (anime ? [anime] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = slides.length;

  // Auto‑play interval
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  if (totalSlides === 0) return null;

  const currentAnime = slides[currentIndex];
  const title = getTitle(currentAnime.title);
  const banner = getBanner(currentAnime.banner_image, currentAnime.cover_image);
  const description = currentAnime.description?.replace(/<[^>]*>/g, '') || '';
  // Use anime_id as slug; fallback to a slug derived from title if needed
  const slug = currentAnime.anime_id || currentAnime.slug || '';

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="relative h-[50vh] min-h-[320px] max-h-[600px] w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={banner}
          alt={title}
          className="h-full w-full object-cover transition-opacity duration-700"
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/1920x600/1a1a2e/ffffff?text=aniyume';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-center px-4 md:px-8 lg:px-12 pt-40 md:pt-12 pb-8 md:pb-12 m-5">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            {currentAnime.status === 'Releasing' && (
              <span className="rounded bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                RELEASING
              </span>
            )}
            {currentAnime.format && (
              <span className="rounded bg-zinc-700/80 px-2 py-0.5 text-xs font-medium text-zinc-300">
                {currentAnime.format}
              </span>
            )}
            {currentAnime.average_score > 0 && (
              <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-bold text-yellow-400">
                ★ {currentAnime.average_score}%
              </span>
            )}
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white drop-shadow-lg line-clamp-2">
            {title}
          </h1>
          <p className="mt-2 line-clamp-2 text-sm text-zinc-300 md:text-base drop-shadow-md max-w-xl">
            {description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            {currentAnime.genres?.length > 0 && (
              <span>• {currentAnime.genres.slice(0, 3).join(', ')}</span>
            )}
            {currentAnime.season && currentAnime.season_year > 0 && (
              <span>• {currentAnime.season} {currentAnime.season_year}</span>
            )}
            {currentAnime.episodes > 0 && (
              <span>• {currentAnime.episodes} eps</span>
            )}
          </div>
          {/* Watch Now button as a Link */}
          {slug ? (
            <Link
              to={`/watch/${slug}/1`}
              className="inline-block mt-4 rounded-lg bg-cyan-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-cyan-500/30 transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95"
            >
              ▶ Watch Now
            </Link>
          ) : (
            <button className="mt-4 rounded-lg bg-cyan-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-cyan-500/30 transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95">
              ▶ Watch Now
            </button>
          )}
        </div>
      </div>

      {/* Slideshow controls - only show if more than one slide */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-cyan-400 w-4'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};