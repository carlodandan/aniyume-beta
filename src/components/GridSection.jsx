import { AnimeCard } from './AnimeCard';

export const GridSection = ({ title, data, seeAll = false }) => {
  if (!data || data.length === 0) return null;

  const displayData = data.slice(0, 8);

  return (
    <section> {/* Stripped redundant nested page padding */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
        {seeAll && data.length > 8 && (
          <button className="text-xs font-semibold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors">
            See All →
          </button>
        )}
      </div>
      {/* Standard streaming media aspect grid sizing */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {displayData.map((item) => (
          <AnimeCard key={item.anime_id} anime={item} size="normal" />
        ))}
      </div>
    </section>
  );
};