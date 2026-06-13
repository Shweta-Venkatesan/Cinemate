import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Info, Heart, HeartOff, Bookmark, BookmarkCheck, Star } from 'lucide-react'
import { backdropUrl, GENRE_MAP } from '../../services/tmdbService'
import { useInteractions } from '../../hooks/useInteractions'

export default function HeroBanner({ movies = [], onPlayTrailer }) {
  const navigate = useNavigate()
  const [currentIdx, setCurrentIdx] = useState(0)
  const { toggleReaction, toggleWatchlist, getReaction, inWatchlist } = useInteractions()

  const movie = movies[currentIdx]

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (movies.length <= 1) return
    const t = setInterval(() => setCurrentIdx(i => (i + 1) % Math.min(movies.length, 5)), 8000)
    return () => clearInterval(t)
  }, [movies.length])

  if (!movie) {
    return <div className="w-full h-[60vh] skeleton" />
  }

  const reaction = getReaction(movie.id)
  const saved = inWatchlist(movie.id)
  const genres = (movie.genre_ids || [])
    .slice(0, 3)
    .map(id => GENRE_MAP[id])
    .filter(Boolean)

  return (
    <div className="relative w-full h-[60vh] sm:h-[75vh] overflow-hidden">
      {/* Backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {movie.backdrop_path ? (
            <img
              src={backdropUrl(movie.backdrop_path, 'w1280')}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-light" />
          )}
          {/* Gradients */}
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-bottom-fade" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent hidden md:block" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-20 sm:pb-24">
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-3">
                {genres.map(g => (
                  <span key={g} className="badge bg-primary/20 text-primary border border-primary/30 text-xs">
                    {g}
                  </span>
                ))}
                {movie.vote_average > 0 && (
                  <span className="badge bg-accent-gold/20 text-accent-gold border border-accent-gold/30 text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-3 leading-tight">
                {movie.title}
              </h1>

              {/* Overview */}
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 mb-5">
                {movie.overview}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onPlayTrailer?.(movie.id)}
                  className="btn-primary shadow-lg shadow-primary/25"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Play Trailer</span>
                </button>

                <button
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="btn-secondary"
                >
                  <Info className="w-5 h-5" />
                  <span>More Info</span>
                </button>

                <div className="flex gap-2 ml-1">
                  <IconAction
                    title={reaction === 'like' ? 'Unlike' : 'Like'}
                    active={reaction === 'like'}
                    activeClass="bg-primary"
                    onClick={() => toggleReaction(movie, 'like')}
                  >
                    <Heart className={`w-4 h-4 ${reaction === 'like' ? 'fill-white' : ''}`} />
                  </IconAction>
                  <IconAction
                    title={saved ? 'Remove from list' : 'Add to My List'}
                    active={saved}
                    activeClass="bg-accent-green"
                    onClick={() => toggleWatchlist(movie)}
                  >
                    {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </IconAction>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {movies.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIdx ? 'w-6 bg-primary' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const IconAction = ({ children, onClick, active, activeClass, title }) => (
  <button
    title={title}
    onClick={onClick}
    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
      active
        ? `${activeClass} border-transparent text-white`
        : 'border-white/30 text-text-secondary hover:border-white hover:text-white bg-black/30'
    }`}
  >
    {children}
  </button>
)
