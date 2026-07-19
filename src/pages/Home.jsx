import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import HeroSlideshow from '../components/HeroSlideshow'
import Section from '../components/Section'
import LoadingSkeleton from '../components/LoadingSkeleton'
import Footer from '../components/Footer'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchHome() {
      try {
        setLoading(true)
        const res = await fetch('/api/home', {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!json.success) throw new Error(json.message || 'API returned error')
        setData(json.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHome()
  }, [])

  const heroAnimes = useMemo(() => {
    if (!data) return []
    const trending = data.trendingNow || []
    const popular = data.popularThisSeason || []
    const airing = data.airingToday?.map(item => item.media) || []
    const all = [...trending, ...popular, ...airing]
    const seen = new Set()
    return all.filter(item => {
      if (!item?.id) return false
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
  }, [data])

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-2xl font-semibold text-[var(--text-h)]">Oops! Something went wrong</h2>
        <p className="text-[var(--text)] mt-2 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-[var(--accent)] text-white px-6 py-2 rounded-full hover:bg-[var(--accent)]/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {loading ? (
          <div className="w-full aspect-[21/9] md:aspect-[21/8] shimmer rounded-none md:rounded-xl mx-auto" />
        ) : (
          <div className="px-4 md:px-8 pt-4 md:pt-6">
            <HeroSlideshow animes={heroAnimes} onPlay={(id) => console.log('Play', id)} />
          </div>
        )}

        {loading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : (
          <>
            <Section
              title="Airing Today"
              items={data?.airingToday?.map(item => ({ ...item, ...item.media })) || []}
              variant="airing"
            />
            <Section
              title="Trending Now"
              items={data?.trendingNow || []}
              variant="default"
            />
            <Section
              title="Popular This Season"
              items={data?.popularThisSeason || []}
              variant="default"
            />
            <Section
              title="Top Recommendations"
              items={data?.topRecommendations || []}
              variant="recommendation"
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}