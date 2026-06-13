import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import MovieCard from './MovieCard'
import { SkeletonCard } from '../ui/SkeletonCard'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export default function MovieRow({
  title, movies, isLoading, showBadge = false,
  emptyMessage = 'No movies found', cardProps = {}
}) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    const w = scrollRef.current.clientWidth
    scrollRef.current.scrollBy({ left: dir === 'left' ? -w * 0.8 : w * 0.8, behavior: 'smooth' })
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="section-title mb-0">{title}</h2>
        {!isLoading && movies?.length > 5 && (
          <div className="hidden sm:flex gap-1">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-surface-light hover:bg-surface border border-white/10 flex items-center justify-center transition-colors duration-150"
            >
              <ChevronLeft className="w-4 h-4 text-text-secondary" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-surface-light hover:bg-surface border border-white/10 flex items-center justify-center transition-colors duration-150"
            >
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="row-scroll px-1">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : movies?.length > 0 ? (
          <motion.div
            className="flex gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {movies.map((movie) => (
              <motion.div key={movie.id || movie.movieId} variants={itemVariants}>
                <MovieCard movie={movie} showBadge={showBadge} {...cardProps} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-text-secondary text-sm py-4">{emptyMessage}</p>
        )}
      </div>
    </section>
  )
}
