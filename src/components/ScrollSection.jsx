import { AnimeCard } from './AnimeCard';

export const ScrollSection = ({ title, data, seeAll = false, size = 'normal' }) => {
  if (!data || data.length === 0) return null;

  return (
    <section> {/* Stripped redundant nested page padding */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
        {seeAll && (
          <button className="text-xs font-semibold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors">
            See All →
          </button>
        )}
      </div>
      
      {/* Mask trailing edges cleanly during sideways tracking */}
      <div className="no-scrollbar -mx-2 overflow-x-auto px-2 pb-2">
        <div className="flex gap-4">
          {data.map((item) => (
            <AnimeCard key={item.anime_id} anime={item} size={size} />
          ))}
        </div>
      </div>
    </section>
  );
};