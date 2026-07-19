import AnimeCard from './AnimeCard'

export default function Section({ title, items, variant = 'default', onItemClick }) {
  if (!items || items.length === 0) return null

  return (
    <section className="px-4 md:px-8 py-6 md:py-8">
      <div className="section-title mb-4">
        <span className="accent-line" />
        <h2 className="text-xl md:text-2xl font-semibold text-[var(--text-h)] m-0">{title}</h2>
      </div>
      <div className="overflow-x-auto no-scrollbar pb-4">
        <div className="flex gap-4 w-max">
          {items.map((item, idx) => {
            const key = item?.media?.id || item?.id || idx
            return (
              <AnimeCard
                key={key}
                item={item}
                variant={variant}
                onClick={onItemClick}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}