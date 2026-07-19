import { AnimeCard } from './AnimeCard';

export const ScrollSection = ({ title, data, seeAll = false, size = 'normal' }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="px-4 md:px-8 lg:px-12">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
        {seeAll && (
          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            See All →
          </button>
        )}
      </div>
      <div className="scrollbar-hide -mx-2 overflow-x-auto px-2 pb-4">
        <div className="flex gap-3">
          {data.map((item) => (
            <AnimeCard key={item.anime_id} anime={item} size={size} />
          ))}
        </div>
      </div>
    </section>
  );
};