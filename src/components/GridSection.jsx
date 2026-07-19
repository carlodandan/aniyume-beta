import { AnimeCard } from './AnimeCard';

export const GridSection = ({ title, data, seeAll = false }) => {
  if (!data || data.length === 0) return null;

  const displayData = data.slice(0, 8);

  return (
    <section className="px-4 md:px-8 lg:px-12">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
        {seeAll && data.length > 8 && (
          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            See All →
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {displayData.map((item) => (
          <AnimeCard key={item.anime_id} anime={item} size="small" />
        ))}
      </div>
    </section>
  );
};