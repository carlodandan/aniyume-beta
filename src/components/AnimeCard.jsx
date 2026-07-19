import { getTitle, formatAiringTime } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'

export default function AnimeCard({ item, variant = 'default' }) {
  const navigate = useNavigate()
  const title = getTitle(item)
  const image = item?.coverImage?.large || item?.media?.coverImage?.large || ''
  const episode = item?.episode || item?.episodes || null
  const rating = item?.rating || null
  const media = item?.media || item
  const id = media?.id || item?.id

  const handleClick = () => {
    if (id) navigate(`/anime/${id}`)
  }

  return (
    <div
      className="anime-card relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden bg-[var(--code-bg)] w-[180px] md:w-[200px]"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-[var(--border)]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text)] text-sm">
            No image
          </div>
        )}

        {episode !== null && variant !== 'recommendation' && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {episode}
          </div>
        )}

        {rating !== null && variant === 'recommendation' && (
          <div className="absolute top-2 right-2 bg-[var(--accent)] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            ★ {rating}
          </div>
        )}

        {variant === 'airing' && item?.airingAt && (
          <div className="absolute top-2 right-2 bg-green-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg airing-badge flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {formatAiringTime(item.airingAt)}
          </div>
        )}
      </div>

      <div className="p-3 text-left">
        <p className="text-sm font-medium text-[var(--text-h)] line-clamp-2 leading-snug">
          {title}
        </p>
        {variant === 'recommendation' && item?.mediaRecommendation && (
          <p className="text-xs text-[var(--text)] mt-1 truncate">
            ↳ Also: {getTitle(item.mediaRecommendation)}
          </p>
        )}
        {variant === 'airing' && item?.media?.title && (
          <p className="text-xs text-[var(--text)] mt-1 truncate">
            Ep {item.episode}
          </p>
        )}
      </div>
    </div>
  )
}