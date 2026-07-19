export function getTitle(item) {
  if (!item?.title) return 'Untitled'
  return item.title.english || item.title.romaji || 'Untitled'
}

export function formatAiringTime(timestamp) {
  if (!timestamp) return 'Soon'
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diff = date - now
  if (diff < 0) return 'Now airing'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) {
    const mins = Math.floor(diff / (1000 * 60))
    return `${mins}m`
  }
  if (hours < 24) return `${hours}h`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}