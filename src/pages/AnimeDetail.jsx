// src/pages/AnimeDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
  const anilist = anime.anilist || {};
  const episodes = anime.episodes || [];
  const sortedEpisodes = [...episodes].reverse();

  // Helper to format date
  const formatDate = (dateObj) => {
    if (!dateObj) return '';
    const { year, month, day } = dateObj;
    if (!year || !month || !day) return '';
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Character & staff data
  const mainCharacters = anilist.characters?.edges?.filter(edge => edge.role === 'MAIN') || [];
  const supportingCharacters = anilist.characters?.edges?.filter(edge => edge.role === 'SUPPORTING') || [];
  const allCharacters = [...mainCharacters, ...supportingCharacters];
  const staffEdges = anilist.staff?.edges || [];

  // Cover image – prefer root cover_image, fallback to anilist.coverImage
  const coverImage = anime.cover_image?.large || anilist.coverImage?.large || anilist.coverImage?.medium || null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 antialiased selection:bg-cyan-500/30">
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Top section: Image + Info */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 m-12">
          {/* Left: Cover Image */}
          <div className="flex-shrink-0">
            {coverImage ? (
              <img
                src={coverImage}
                alt={anilist.title?.english || anilist.title?.romaji || 'Cover'}
                className="w-full max-w-[240px] md:max-w-[280px] rounded-lg shadow-lg object-cover"
              />
            ) : (
              <div className="w-full max-w-[240px] md:max-w-[280px] aspect-[2/3] bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 text-sm">
                No cover
              </div>
            )}
          </div>

          {/* Right: Title, Description, Metadata */}
          <div className="flex-1 space-y-4 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {anilist.title?.english || anilist.title?.romaji || anilist.title?.native || 'Untitled'}
            </h1>
            {anilist.title?.native && anilist.title?.native !== anilist.title?.english && (
              <p className="text-sm text-zinc-400">{anilist.title.native}</p>
            )}

            {anilist.description && (
              <div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">Synopsis</h2>
                <p
                  className="text-sm text-zinc-400 leading-relaxed line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: anilist.description }}
                />
              </div>
            )}

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-zinc-400">
              {anilist.format && (
                <>
                  <dt className="font-medium text-zinc-500">Format</dt>
                  <dd>{anilist.format}</dd>
                </>
              )}
              {anilist.status && (
                <>
                  <dt className="font-medium text-zinc-500">Status</dt>
                  <dd>{anilist.status}</dd>
                </>
              )}
              {anilist.episodes > 0 && (
                <>
                  <dt className="font-medium text-zinc-500">Episodes</dt>
                  <dd>{anilist.episodes}</dd>
                </>
              )}
              {anilist.duration > 0 && (
                <>
                  <dt className="font-medium text-zinc-500">Duration</dt>
                  <dd>{anilist.duration} min</dd>
                </>
              )}
              {anilist.season && anilist.seasonYear && (
                <>
                  <dt className="font-medium text-zinc-500">Season</dt>
                  <dd>{anilist.season} {anilist.seasonYear}</dd>
                </>
              )}
              {anilist.averageScore > 0 && (
                <>
                  <dt className="font-medium text-zinc-500">Score</dt>
                  <dd className="text-yellow-400">★ {anilist.averageScore}%</dd>
                </>
              )}
              {anilist.genres?.length > 0 && (
                <>
                  <dt className="font-medium text-zinc-500">Genres</dt>
                  <dd>{anilist.genres.join(', ')}</dd>
                </>
              )}
              {anilist.source && (
                <>
                  <dt className="font-medium text-zinc-500">Source</dt>
                  <dd>{anilist.source}</dd>
                </>
              )}
              {anilist.startDate && (
                <>
                  <dt className="font-medium text-zinc-500">Start Date</dt>
                  <dd>{formatDate(anilist.startDate)}</dd>
                </>
              )}
              {anilist.endDate && (
                <>
                  <dt className="font-medium text-zinc-500">End Date</dt>
                  <dd>{formatDate(anilist.endDate)}</dd>
                </>
              )}
            </dl>
          </div>
        </div>

        {/* Episodes + Sidebar (staff & characters) – same as before */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-8">
            {sortedEpisodes.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Episodes</h2>
                <div className="max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                  <ul className="space-y-2">
                    {sortedEpisodes.map((ep) => {
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
            <div className="sticky top-6 space-y-6">
              {/* Studios */}
              {anilist.studios?.nodes?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Studios</h3>
                  <ul className="space-y-1 text-sm text-zinc-400">
                    {anilist.studios.nodes.map((studio, idx) => (
                      <li key={idx}>{studio.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Characters */}
              {allCharacters.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Characters</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {allCharacters.slice(0, 8).map((edge, idx) => {
                      const char = edge.node;
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          {char.image?.large ? (
                            <img
                              src={char.image.large}
                              alt={char.name.full}
                              className="w-10 h-10 rounded-full object-cover bg-zinc-800"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-500">
                              ?
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{char.name.full}</p>
                            <p className="text-xs text-zinc-500 capitalize">{edge.role.toLowerCase()}</p>
                          </div>
                        </div>
                      );
                    })}
                    {allCharacters.length > 8 && (
                      <p className="text-xs text-zinc-500">+{allCharacters.length - 8} more</p>
                    )}
                  </div>
                </div>
              )}

              {/* Staff */}
              {staffEdges.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Staff</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {staffEdges.slice(0, 8).map((edge, idx) => {
                      const staff = edge.node;
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          {staff.image?.large ? (
                            <img
                              src={staff.image.large}
                              alt={staff.name.full}
                              className="w-10 h-10 rounded-full object-cover bg-zinc-800"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-500">
                              ?
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{staff.name.full}</p>
                            <p className="text-xs text-zinc-500 truncate">{edge.role}</p>
                          </div>
                        </div>
                      );
                    })}
                    {staffEdges.length > 8 && (
                      <p className="text-xs text-zinc-500">+{staffEdges.length - 8} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnimeDetail;