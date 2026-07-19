import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getTitle, getCover } from '../utils/helpers';

export const TopSection = ({ compact = false }) => {
  const [period, setPeriod] = useState('today');
  const { data, loading, error } = useFetch(`/api/top?period=${period}`);

  const tabs = [
    { key: 'today', label: 'Daily' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ];

  const topData = data?.data || [];
  const isCompact = compact;

  // Responsive: on mobile, full width; on lg, sidebar
  return (
    <section className={`${isCompact ? 'space-y-3' : 'space-y-4'}`}>
      <div className={`flex items-center justify-between ${isCompact ? 'mb-2' : 'mb-4'}`}>
        <h2 className={`font-bold text-white ${isCompact ? 'text-base' : 'text-lg md:text-xl'}`}>
          🏆 Top
        </h2>
        <div className={`flex gap-1 rounded-lg bg-zinc-800/80 p-1 ${isCompact ? 'text-xs' : ''}`}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setPeriod(tab.key)}
              className={`px-2 py-1 font-medium rounded-md transition-all duration-200 ${
                period === tab.key
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              } ${isCompact ? 'text-xs' : 'text-sm'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 p-3 text-center text-xs text-red-400">
          Failed to load: {error}
        </div>
      )}

      {!loading && !error && topData.length === 0 && (
        <div className="rounded-lg bg-zinc-800/30 p-6 text-center text-xs text-zinc-500">
          No data available for {period}
        </div>
      )}

      {!loading && !error && topData.length > 0 && (
        <div className="space-y-2">
          {topData.slice(0, isCompact ? 10 : 10).map((item, idx) => {
            const rank = idx + 1;
            const title = getTitle(item.title);
            const cover = getCover(item.cover_image);
            const isTop3 = rank <= 3;

            return (
              <div
                key={item.anime_id}
                className={`group flex items-center gap-3 rounded-xl p-1.5 transition-all duration-200 hover:bg-zinc-800/60 cursor-pointer ${
                  isTop3 ? 'bg-zinc-800/30' : ''
                }`}
              >
                <div
                  className={`w-6 text-center font-bold ${
                    isCompact ? 'text-xs' : 'text-sm'
                  } ${
                    rank === 1
                      ? 'text-yellow-400'
                      : rank === 2
                      ? 'text-zinc-300'
                      : rank === 3
                      ? 'text-amber-600'
                      : 'text-zinc-600'
                  }`}
                >
                  #{rank}
                </div>
                <div className="h-12 w-8 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={cover}
                    alt={title}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40x56/1a1a2e/ffffff?text=?'; }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate font-medium text-white group-hover:text-cyan-400 transition-colors ${
                      isCompact ? 'text-xs' : 'text-sm'
                    }`}
                  >
                    {title}
                  </p>
                  <div className={`flex items-center gap-2 text-zinc-500 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
                    {item.average_score > 0 && (
                      <span className="text-yellow-400/80">★ {item.average_score}%</span>
                    )}
                    {item.episodes > 0 && <span>{item.episodes} eps</span>}
                    {item.status && (
                      <span className={`${item.status === 'Releasing' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
                {isTop3 && (
                  <div className="hidden sm:block text-xs font-medium px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};