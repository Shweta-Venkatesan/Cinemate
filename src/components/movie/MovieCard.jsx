import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Bookmark, BookmarkCheck, Info, Star, X } from 'lucide-react'
import { posterUrl } from '../../services/tmdbService'
import { useInteractions } from '../../hooks/useInteractions'
import { GENRE_MAP } from '../../services/tmdbService'

const MATCH_BADGE = {
  title: { label: '🔤 Title', cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  genre: { label: '🎭 Genre', cls: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  actor: { label: '🎬 Actor', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  keyword: { label: '#️⃣ Keyword', cls: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
}

export default function MovieCard({ movie, showBadge = false, reason = null, compact = false, onRemove = null }) {
  const navigate = useNavigate()
  const { toggleReaction, toggleWatchlist, getReaction, inWatchlist } = useInteractions()
  const [imgError, setImgError] = useState(false)

  if (!movie) return null

  const movieId = movie.id || movie.movieId
  const title = movie.title || 'Untitled'
  const poster = movie.poster_path || movie.posterPath
  const rating = movie.vote_average?.toFixed(1)
  const year = movie.release_date?.slice(0, 4) || movie.year || ''
  const reaction = getReaction(movieId)
  const saved = inWatchlist(movieId)

  const badge = showBadge && movie.matchType && MATCH_BADGE[movie.matchType]

  const handleClick = (e) => {
    e.preventDefault()
    navigate(`/movie/${movieId}`)
  }

  const handleAction = (e, fn) => {
    e.preventDefault()
    e.stopPropagation()
    fn()
  }

  return (
    <motion.div
      className={`shrink-0 group cursor-pointer ${compact ? 'w-28 sm:w-32' : 'w-32 sm:w-40 lg:w-48 xl:w-52'}`}
      whileHover={{ scale: 1.06, zIndex: 10 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-surface-light shadow-lg">
        {/* Poster */}
        {poster && !imgError ? (
          <img
            src={posterUrl(poster, 'w342')}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-light">
            <div className="text-center px-2">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-xs text-text-secondary line-clamp-2 text-center">{title}</p>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Remove button — shown only in Continue Watching row */}
        {onRemove && (
          <button
            title="Remove from Continue Watching"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(movie) }}
            className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-500 text-white flex items-center justify-center transition-colors duration-150 z-20"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Match badge */}
        {badge && (
          <div className={`absolute top-2 left-2 badge border ${badge.cls} text-[10px]`}>
            {badge.label}
          </div>
        )}

        {/* Rating chip */}
        {rating && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5">
            <Star className="w-2.5 h-2.5 fill-accent-gold text-accent-gold" />
            <span className="text-[10px] font-semibold text-white">{rating}</span>
          </div>
        )}

        {/* Action buttons (shown on hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-1">
            <ActionBtn
              title={reaction === 'like' ? 'Unlike' : 'Like'}
              onClick={(e) => handleAction(e, () => toggleReaction(movie, 'like'))}
              className={reaction === 'like' ? 'bg-primary text-white' : 'bg-black/60 text-white hover:bg-primary/80'}
            >
              <Heart className={`w-3.5 h-3.5 ${reaction === 'like' ? 'fill-white' : ''}`} />
            </ActionBtn>
            <ActionBtn
              title={saved ? 'Remove from list' : 'Add to list'}
              onClick={(e) => handleAction(e, () => toggleWatchlist(movie))}
              className={saved ? 'bg-accent-green text-white' : 'bg-black/60 text-white hover:bg-accent-green/80'}
            >
              {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </ActionBtn>
          </div>
          <ActionBtn
            title="More info"
            onClick={handleClick}
            className="bg-black/60 text-white hover:bg-white/20"
          >
            <Info className="w-3.5 h-3.5" />
          </ActionBtn>
        </div>
      </div>

      {/* Title */}
      <div className="mt-2 px-0.5">
        <p className="text-xs sm:text-sm font-medium text-text-primary line-clamp-2 group-hover:text-white transition-colors duration-150">
          {title}
        </p>
        <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5">{year}</p>
        {reason && (
          <p className="text-[10px] text-primary mt-0.5 line-clamp-1">✨ {reason}</p>
        )}
      </div>
    </motion.div>
  )
}

const ActionBtn = ({ children, onClick, className, title }) => (
  <button
    title={title}
    onClick={onClick}
    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 ${className}`}
  >
    {children}
  </button>
)
