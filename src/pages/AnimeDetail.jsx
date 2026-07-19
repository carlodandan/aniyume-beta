import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AnimeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [showEpisodes, setShowEpisodes] = useState(false)

  useEffect(() => {
    async function fetchAnime() {
      try {
        setLoading(true)
        const res = await fetch(`/api/anime/${id}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setAnime(json.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchAnime()
  }, [id])

  const fetchEpisodes = async () => {
    if (episodes.length > 0) {
      setShowEpisodes(!showEpisodes)
      return
    }
    try {
      setLoadingEpisodes(true)
      const res = await fetch(`/api/episodes/${id}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setEpisodes(data)
      setShowEpisodes(true)
    } catch (err) {
      console.error('Failed to fetch episodes:', err)
      alert('Could not load episodes')
    } finally {
      setLoadingEpisodes(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-[var(--text)]">Loading anime details...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !anime) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">😵</div>
            <h2 className="text-2xl font-semibold text-[var(--text-h)]">Failed to load anime</h2>
            <p className="text-[var(--text)] mt-2">{error || 'Anime not found'}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 bg-[var(--accent)] text-white px-6 py-2 rounded-full hover:bg-[var(--accent)]/80 transition-colors"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Extract data
  const {
    title,
    title_english,
    title_japanese,
    images,
    synopsis,
    score,
    rank,
    popularity,
    members,
    status,
    aired,
    duration,
    rating,
    episodes: totalEpisodes,
    season,
    year,
    broadcast,
    genres = [],
    studios = [],
    producers = [],
    licensors = [],
    demographics = [],
  } = anime

  const displayTitle = title_english || title || 'Untitled'
  const japaneseTitle = title_japanese || ''
  const coverImage = images?.webp?.large_image_url || images?.jpg?.large_image_url || ''
  const synopsisText = synopsis || 'No synopsis available.'
  const airedString = aired?.string || ''

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 px-4 md:px-8 py-6 md:py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-[var(--text)] hover:text-[var(--text-h)] transition-colors"
        >
          ← Back
        </button>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="relative rounded-xl overflow-hidden bg-[var(--border)] aspect-[21/9] md:aspect-[21/8]">
            {coverImage && (
              <img
                src={coverImage}
                alt={displayTitle}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                {displayTitle}
              </h1>
              {japaneseTitle && (
                <p className="text-white/80 text-sm md:text-base mt-1">{japaneseTitle}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3 text-white/90 text-sm">
                {status && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {status}
                  </span>
                )}
                {totalEpisodes !== null && totalEpisodes !== undefined && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {totalEpisodes} episodes
                  </span>
                )}
                {season && year && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {season.charAt(0).toUpperCase() + season.slice(1)} {year}
                  </span>
                )}
                {broadcast?.string && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {broadcast.string}
                  </span>
                )}
              </div>
              {/* Watch button */}
              <button
                onClick={() => navigate(`/watch/${anime.id}`)}
                className="mt-4 inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm md:text-base w-fit shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {loadingEpisodes ? 'Loading...' : showEpisodes ? 'Hide Episodes' : 'Watch'}
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-[var(--code-bg)] rounded-xl">
            {score && (
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text)]">Score</div>
                <div className="text-lg font-semibold text-[var(--text-h)]">{score}</div>
              </div>
            )}
            {rank && (
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text)]">Rank</div>
                <div className="text-lg font-semibold text-[var(--text-h)]">#{rank}</div>
              </div>
            )}
            {popularity && (
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text)]">Popularity</div>
                <div className="text-lg font-semibold text-[var(--text-h)]">#{popularity}</div>
              </div>
            )}
            {members && (
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text)]">Members</div>
                <div className="text-lg font-semibold text-[var(--text-h)]">{members.toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Episodes List (collapsible) */}
          {showEpisodes && (
            <div className="mt-6 bg-[var(--code-bg)] rounded-xl p-4 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-[var(--text-h)] mb-3">Episodes</h3>
              {loadingEpisodes ? (
                <div className="text-[var(--text)]">Loading episodes...</div>
              ) : episodes.length > 0 ? (
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {episodes.map((ep, index) => (
                    <li
                      key={index}
                      className="bg-[var(--bg)] text-[var(--text-h)] px-3 py-2 rounded-lg text-sm flex items-center justify-between hover:bg-[var(--accent-bg)] transition-colors"
                    >
                      <span>Episode {ep.number || index + 1}</span>
                      {ep.title && <span className="text-xs text-[var(--text)] truncate ml-2">{ep.title}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[var(--text)]">No episodes found.</div>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left: Synopsis */}
            <div className="lg:col-span-2 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-h)] mb-2">Synopsis</h2>
                <p className="text-[var(--text)] leading-relaxed whitespace-pre-line">
                  {synopsisText}
                </p>
              </section>

              {/* Genres & Demographics */}
              <section>
                <h2 className="text-xl font-semibold text-[var(--text-h)] mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {genres.map(g => (
                    <span key={g.mal_id} className="bg-[var(--code-bg)] text-[var(--text-h)] px-3 py-1 rounded-full text-sm">
                      {g.name}
                    </span>
                  ))}
                  {demographics.map(d => (
                    <span key={d.mal_id} className="bg-[var(--accent-bg)] text-[var(--accent)] px-3 py-1 rounded-full text-sm border border-[var(--accent-border)]">
                      {d.name}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              {airedString && (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)]">Aired</h3>
                  <p className="text-[var(--text-h)] mt-1">{airedString}</p>
                </section>
              )}
              {duration && (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)]">Duration</h3>
                  <p className="text-[var(--text-h)] mt-1">{duration}</p>
                </section>
              )}
              {rating && (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)]">Rating</h3>
                  <p className="text-[var(--text-h)] mt-1">{rating}</p>
                </section>
              )}
              {studios.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)]">Studios</h3>
                  <ul className="mt-2 space-y-1">
                    {studios.map(s => (
                      <li key={s.mal_id} className="text-[var(--text-h)]">{s.name}</li>
                    ))}
                  </ul>
                </section>
              )}
              {producers.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)]">Producers</h3>
                  <ul className="mt-2 space-y-1">
                    {producers.map(p => (
                      <li key={p.mal_id} className="text-[var(--text-h)]">{p.name}</li>
                    ))}
                  </ul>
                </section>
              )}
              {licensors.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)]">Licensors</h3>
                  <ul className="mt-2 space-y-1">
                    {licensors.map(l => (
                      <li key={l.mal_id} className="text-[var(--text-h)]">{l.name}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}