// src/pages/AnimeDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { Hero } from '../components/Hero';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getTitle } from '../utils/helpers';

const AnimeDetail = () => {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(`/api/info/${slug}`);
  const [thumbnails, setThumbnails] = useState({});

  // Fetch thumbnails when anime data loads (has anilist_id)
  useEffect(() => {
    if (data?.anilist_id) {
      fetch(`/api/thumbnails/${data.anilist_id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch thumbnails');
          return res.json();
        })
        .then(result => {
          if (result.success && result.thumbnails) {
            setThumbnails(result.thumbnails);
          }
        })
        .catch(err => {
          console.warn('Thumbnail fetch error:', err);
        });
    }
  }, [data]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#0a0a0f]">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <p className="mt-4 text-zinc-500">Loading anime details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#0a0a0f]">
          <div className="text-center max-w-md px-4">
            <div className="text-6xl mb-4">😿</div>
            <h2 className="text-xl font-bold text-white mb-2">Could not load anime</h2>
            <p className="text-zinc-500 text-sm">{error || 'No data available'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-cyan-500 px-6 py-2 font-medium text-white hover:bg-cyan-400 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const anime = data;
  const episodes = anime.episodes || [];
  const title = getTitle(anime.title);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 antialiased selection:bg-cyan-500/30">
      <Header />

      <Hero anime={anime} />

      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-8">
            {anime.description && (
              <section>
                <h2 className="text-xl font-bold text-white mb-3">Synopsis</h2>
                <p
                  className="text-sm text-zinc-400 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: anime.description }}
                />
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Details</h2>
              <dl className="grid grid-cols-2 gap-2 text-sm text-zinc-400">
                {anime.format && (
                  <>
                    <dt className="font-medium text-zinc-500">Format</dt>
                    <dd>{anime.format}</dd>
                  </>
                )}
                {anime.status && (
                  <>
                    <dt className="font-medium text-zinc-500">Status</dt>
                    <dd>{anime.status}</dd>
                  </>
                )}
                {anime.episodes > 0 && (
                  <>
                    <dt className="font-medium text-zinc-500">Episodes</dt>
                    <dd>{anime.episodes}</dd>
                  </>
                )}
                {anime.season && anime.season_year > 0 && (
                  <>
                    <dt className="font-medium text-zinc-500">Season</dt>
                    <dd>{anime.season} {anime.season_year}</dd>
                  </>
                )}
                {anime.average_score > 0 && (
                  <>
                    <dt className="font-medium text-zinc-500">Score</dt>
                    <dd className="text-yellow-400">★ {anime.average_score}%</dd>
                  </>
                )}
                {anime.genres?.length > 0 && (
                  <>
                    <dt className="font-medium text-zinc-500">Genres</dt>
                    <dd>{anime.genres.join(', ')}</dd>
                  </>
                )}
              </dl>
            </section>

            {episodes.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Episodes</h2>
                <div className="max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                  <ul className="space-y-2">
                    {episodes.map((ep) => {
                      const thumbKey = String(ep.episode_number - 1);
                      const thumbnailUrl = thumbnails[thumbKey] || ep.thumbnail || null;

                      return (
                        <Link
                          key={ep.episodeId || ep.episode_number}
                          to={`/watch/${slug}/${ep.episode_number}`}
                          className="flex items-center gap-4 rounded-lg bg-zinc-800/40 p-3 transition-colors hover:bg-zinc-800/70"
                        >
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={ep.title || `Episode ${ep.episode_number}`}
                              className="h-16 w-28 object-cover rounded"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="h-16 w-28 bg-zinc-700 rounded flex items-center justify-center text-zinc-500 text-xs">
                              No image
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded">
                                EP {ep.episode_number}
                              </span>
                              {ep.is_filler && (
                                <span className="text-[10px] text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                                  Filler
                                </span>
                              )}
                              {ep.is_recap && (
                                <span className="text-[10px] text-zinc-400 bg-zinc-500/20 px-1.5 py-0.5 rounded">
                                  Recap
                                </span>
                              )}
                            </div>
                            <p className="truncate text-sm font-medium text-white">
                              {ep.title || `Episode ${ep.episode_number}`}
                            </p>
                            {ep.title_japanese && (
                              <p className="truncate text-xs text-zinc-500">{ep.title_japanese}</p>
                            )}
                            {ep.aired && (
                              <p className="text-[10px] text-zinc-600">
                                Aired: {new Date(ep.aired).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {ep.url && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(ep.url, '_blank', 'noopener,noreferrer');
                              }}
                              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                            >
                              Source
                            </button>
                          )}
                        </Link>
                      );
                    })}
                  </ul>
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-1 border-t border-zinc-800/60 pt-8 lg:border-t-0 lg:pt-0 lg:pl-4">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-lg bg-zinc-800/30 p-4 text-center">
                <p className="text-xs text-zinc-500">More info coming soon</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnimeDetail;