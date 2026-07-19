import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function WatchPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSource, setActiveSource] = useState(null)
  const [activeAudio, setActiveAudio] = useState('sub')

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        setLoading(true)
        const res = await fetch(`/api/episodes/${id}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setData(json)
        // Set first available source as active
        const sources = Object.keys(json).filter(key => key !== 'page' && key !== 'type')
        if (sources.length > 0) {
          setActiveSource(sources[0])
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchEpisodes()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-[var(--text)]">Loading episodes...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">😵</div>
            <h2 className="text-2xl font-semibold text-[var(--text-h)]">Failed to load episodes</h2>
            <p className="text-[var(--text)] mt-2">{error || 'No episodes found'}</p>
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

  // Extract meta title from the first available source
  const firstSource = Object.keys(data).find(key => key !== 'page' && key !== 'type')
  const metaTitle = firstSource ? data[firstSource]?.meta?.title || 'Episodes' : 'Episodes'

  const sources = Object.keys(data).filter(key => key !== 'page' && key !== 'type' && key !== 'mappings')

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 px-4 md:px-8 py-6 md:py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-[var(--text)] hover:text-[var(--text-h)] transition-colors"
        >
          ← Back to Anime
        </button>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-h)] mb-4">
            {metaTitle} – Episodes
          </h1>

          {/* Source Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-[var(--border)] pb-2">
            {sources.map(source => (
              <button
                key={source}
                onClick={() => setActiveSource(source)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  activeSource === source
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--code-bg)] text-[var(--text)] hover:bg-[var(--accent-bg)]'
                }`}
              >
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </button>
            ))}
          </div>

          {/* Audio Tabs (sub/dub) */}
          {activeSource && data[activeSource]?.episodes && (
            <div className="flex gap-2 mb-4">
              {['sub', 'dub'].map(audio => {
                const hasEpisodes = data[activeSource].episodes[audio]?.length > 0
                return (
                  <button
                    key={audio}
                    onClick={() => hasEpisodes && setActiveAudio(audio)}
                    disabled={!hasEpisodes}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeAudio === audio && hasEpisodes
                        ? 'bg-[var(--accent)] text-white'
                        : hasEpisodes
                        ? 'bg-[var(--code-bg)] text-[var(--text)] hover:bg-[var(--accent-bg)]'
                        : 'bg-[var(--border)] text-[var(--text)]/50 cursor-not-allowed'
                    }`}
                  >
                    {audio.toUpperCase()} {hasEpisodes ? `(${data[activeSource].episodes[audio].length})` : '(none)'}
                  </button>
                )
              })}
            </div>
          )}

          {/* Episode List */}
          {activeSource && data[activeSource]?.episodes?.[activeAudio]?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data[activeSource].episodes[activeAudio].map((ep, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--code-bg)] rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[var(--text-h)]">Episode {ep.number}</span>
                    {ep.duration && (
                      <span className="text-xs text-[var(--text)] bg-[var(--bg)] px-2 py-0.5 rounded-full">
                        {Math.floor(ep.duration / 60)}m
                      </span>
                    )}
                  </div>
                  {ep.title && (
                    <h3 className="text-sm font-medium text-[var(--text-h)] mb-1">{ep.title}</h3>
                  )}
                  {ep.description && (
                    <p className="text-xs text-[var(--text)] line-clamp-2 mb-2">{ep.description}</p>
                  )}
                  {ep.airDate && (
                    <p className="text-xs text-[var(--text)] mb-2">
                      Aired: {new Date(ep.airDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  )}
                  <button
                    onClick={() => {
                      // In a real app, navigate to player with the episode id
                      console.log('Play episode:', ep.id)
                      alert(`Play: ${ep.id}`)
                    }}
                    className="mt-auto self-start bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                  >
                    ▶ Play
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[var(--text)] p-8 text-center bg-[var(--code-bg)] rounded-xl">
              No {activeAudio} episodes available for this source.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}