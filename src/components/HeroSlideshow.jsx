import { useState, useEffect, useCallback } from 'react'
import { getTitle } from '../../utils/helpers'

const INTERVAL = 5000

export default function HeroSlideshow({ animes, onPlay }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goTo = useCallback((index) => {
    setCurrentIndex((prev) => {
      // Always return a valid positive index
      const next = ((index % animes.length) + animes.length) % animes.length
      return next
    })
  }, [animes.length])

  useEffect(() => {
    if (!animes || animes.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animes.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [animes])

  if (!animes || animes.length === 0) return null

  const anime = animes[currentIndex]
  const title = getTitle(anime)
  const image = anime?.coverImage?.large || ''
  const episodes = anime?.episodes || null

  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[21/8] overflow-hidden rounded-none md:rounded-xl mx-auto bg-[var(--border)] group">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-700"
          loading="eager"
        />
      )}
      <div className="hero-overlay absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-left">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg m-0 max-w-2xl">
          {title}
        </h1>
        {episodes !== null && (
          <p className="text-white/80 text-sm md:text-base mt-2 drop-shadow">
            {episodes} episodes
          </p>
        )}
        <button
          onClick={() => onPlay?.(anime.id)}
          className="mt-4 inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm md:text-base w-fit shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch Now
        </button>
      </div>

      {/* Dots */}
      {animes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {animes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Optional arrows (uncomment to enable) */}
      {/*
      <button
        onClick={() => goTo(currentIndex - 1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ‹
      </button>
      <button
        onClick={() => goTo(currentIndex + 1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ›
      </button>
      */}
    </div>
  )
}