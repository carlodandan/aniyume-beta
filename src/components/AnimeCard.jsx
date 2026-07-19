import { getTitle, getCover } from '../utils/helpers';

export const AnimeCard = ({ anime, size = 'normal' }) => {
  const title = getTitle(anime.title);
  const cover = getCover(anime.cover_image);
  const isSmall = size === 'small';

  return (
    <div className={`anime-card group flex-shrink-0 ${isSmall ? 'w-32' : 'w-40'} cursor-pointer transition-transform duration-300 hover:-translate-y-1`}>
      <div className="relative overflow-hidden rounded-lg bg-zinc-800">
        <img
          src={cover}
          alt={title}
          className={`w-full object-cover ${isSmall ? 'h-48' : 'h-60'} transition-transform duration-500 group-hover:scale-105`}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Image'; }}
        />
        {anime.episode?.episode_number && (
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
            EP {anime.episode.episode_number}
          </div>
        )}
        {anime.status === 'Releasing' && (
          <div className="absolute top-2 left-2 rounded bg-emerald-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
            NEW
          </div>
        )}
        {anime.average_score > 0 && (
          <div className="absolute top-2 right-2 rounded bg-black/70 px-1 py-0.5 text-[10px] font-bold text-yellow-400">
            ★ {anime.average_score}%
          </div>
        )}
      </div>
      <div className="mt-1.5">
        <p className="line-clamp-1 text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
          {title}
        </p>
        {!isSmall && anime.episode?.title && (
          <p className="line-clamp-1 text-xs text-zinc-400">
            {anime.episode.title}
          </p>
        )}
        {!isSmall && anime.genres?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {anime.genres.slice(0, 2).map((g) => (
              <span key={g} className="text-[10px] text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};