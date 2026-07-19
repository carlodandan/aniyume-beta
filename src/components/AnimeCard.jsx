import { getTitle, getCover } from '../utils/helpers';

export const AnimeCard = ({ anime, size = 'normal' }) => {
  const title = getTitle(anime.title);
  const cover = getCover(anime.cover_image);
  const isSmall = size === 'small';

  return (
    <div className={`group flex flex-col flex-shrink-0 ${isSmall ? 'w-28 sm:w-32' : 'w-36 sm:w-44'} cursor-pointer`}>
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-zinc-900 shadow-md transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:shadow-cyan-500/10">
        <img
          src={cover}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Image'; }}
        />
        
        {/* Absolute indicators */}
        {anime.episode?.episode_number && (
          <div className="absolute bottom-2 right-2 rounded-sm bg-zinc-950/90 px-1.5 py-0.5 text-[10px] font-bold text-zinc-100 backdrop-blur-xs">
            EP {anime.episode.episode_number}
          </div>
        )}
        {anime.status === 'Releasing' && (
          <div className="absolute top-2 left-2 rounded-sm bg-emerald-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-sm">
            New
          </div>
        )}
        {anime.average_score > 0 && (
          <div className="absolute top-2 right-2 rounded-sm bg-zinc-950/80 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400 backdrop-blur-xs">
            ★ {anime.average_score}%
          </div>
        )}
      </div>

      <div className="mt-2.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-zinc-200 group-hover:text-cyan-400 transition-colors duration-200">
          {title}
        </h3>
        {!isSmall && anime.episode?.title && (
          <p className="line-clamp-1 text-xs text-zinc-500 mt-0.5">
            {anime.episode.title}
          </p>
        )}
      </div>
    </div>
  );
};