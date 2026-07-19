export default function LoadingSkeleton() {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-7 bg-[var(--accent)] rounded" />
        <div className="h-7 w-48 shimmer rounded" />
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[180px] md:w-[200px]">
            <div className="aspect-[2/3] w-full shimmer rounded-lg" />
            <div className="mt-2 h-4 w-3/4 shimmer rounded" />
            <div className="mt-1 h-3 w-1/2 shimmer rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}