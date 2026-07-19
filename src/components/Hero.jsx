// src/components/Hero.jsx
import { getTitle, getBanner } from '../utils/helpers';

export const Hero = ({ anime }) => {
  if (!anime) return null;

  const title = getTitle(anime.title);
  const banner = getBanner(anime.banner_image, anime.cover_image);
  const description = anime.description?.replace(/<[^>]*>/g, '') || '';

  return (
    <div className="relative h-[50vh] min-h-[320px] max-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={banner}
          alt={title}
          className="h-full w-full object-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/1920x600/1a1a2e/ffffff?text=aniyume'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/70 via-transparent to-transparent" />
      </div>

      <div className="relative flex h-full items-end px-4 md:px-8 lg:px-12 pb-8 md:pb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            {anime.status === 'Releasing' && (
              <span className="rounded bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">RELEASING</span>
            )}
            {anime.format && (
              <span className="rounded bg-zinc-700/80 px-2 py-0.5 text-xs font-medium text-zinc-300">
                {anime.format}
              </span>
            )}
            {anime.average_score > 0 && (
              <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-bold text-yellow-400">
                ★ {anime.average_score}%
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg line-clamp-2">
            {title}
          </h1>
          <p className="mt-2 line-clamp-2 text-sm text-zinc-300 md:text-base drop-shadow-md max-w-xl">
            {description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            {anime.genres?.length > 0 && (
              <span>• {anime.genres.slice(0, 3).join(', ')}</span>
            )}
            {anime.season && anime.season_year > 0 && (
              <span>• {anime.season} {anime.season_year}</span>
            )}
            {anime.episodes > 0 && (
              <span>• {anime.episodes} eps</span>
            )}
          </div>
          <button className="mt-4 rounded-lg bg-cyan-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-cyan-500/30 transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95">
            ▶ Watch Now
          </button>
        </div>
      </div>
    </div>
  );
};