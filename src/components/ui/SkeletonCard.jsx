export const SkeletonCard = () => (
  <div className="shrink-0 w-32 sm:w-40 lg:w-48 xl:w-52 rounded-xl overflow-hidden">
    <div className="skeleton aspect-[2/3] rounded-xl" />
    <div className="mt-2 space-y-1 px-1">
      <div className="skeleton h-3 rounded w-3/4" />
      <div className="skeleton h-2.5 rounded w-1/2" />
    </div>
  </div>
)

export const SkeletonBanner = () => (
  <div className="skeleton w-full h-[60vh] sm:h-[75vh] rounded-none" />
)

export const SkeletonGrid = ({ count = 12 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl overflow-hidden">
        <div className="skeleton aspect-[2/3] rounded-xl" />
        <div className="mt-2 space-y-1 px-1">
          <div className="skeleton h-3 rounded w-3/4" />
          <div className="skeleton h-2.5 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
)
