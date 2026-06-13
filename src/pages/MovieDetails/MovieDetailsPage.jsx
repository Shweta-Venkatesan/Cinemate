import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, CheckCircle, Heart, Bookmark, BookmarkCheck, Star } from 'lucide-react'
import { useMovieDetails } from '../../hooks/useTmdb'
import { useInteractions } from '../../hooks/useInteractions'
import { backdropUrl, posterUrl } from '../../services/tmdbService'
import PageTransition from '../../components/layout/PageTransition'
import MovieRow from '../../components/movie/MovieRow'
import CastCard from '../../components/movie/CastCard'
import TrailerModal from '../../components/movie/TrailerModal'
import StarRating from '../../components/ui/StarRating'

export default function MovieDetailsPage() {
  const { id } = useParams()
  const { data, isLoading } = useMovieDetails(id)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const {
    recordView, markWatched, toggleReaction, toggleWatchlist, rateMovie,
    getReaction, inWatchlist, getRating, isWatched
  } = useInteractions()

  useEffect(() => {
    if (data?.details) recordView(data.details)
  }, [data?.details?.id, recordView])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="w-full h-[50vh] sm:h-[70vh] skeleton" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-4">
          <div className="h-8 w-2/3 skeleton rounded-xl" />
          <div className="h-4 w-full skeleton rounded-xl" />
          <div className="h-4 w-5/6 skeleton rounded-xl" />
        </div>
      </div>
    )
  }

  if (!data?.details) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-white">
        Movie not found
      </div>
    )
  }

  const { details, credits, videos, similar } = data
  const reaction = getReaction(details.id)
  const saved = inWatchlist(details.id)
  const myRating = getRating(details.id)
  const watched = isWatched(details.id)
  const trailerVideo = videos?.[0]
  const director = credits?.crew?.find(c => c.job === 'Director')

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">

        {/* ── Backdrop Hero ─────────────────────────────────────────────────── */}
        <div className="relative w-full h-[42vh] sm:h-[65vh] lg:h-[75vh]">
          {/* Background image / Video Trailer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
            {trailerVideo ? (
              <>
                <iframe
                  className="absolute top-1/2 left-1/2 w-[300vw] sm:w-[150vw] aspect-video max-w-none -translate-x-1/2 -translate-y-1/2 opacity-50"
                  src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&loop=1&modestbranding=1&playsinline=1&rel=0&playlist=${trailerVideo.key}`}
                  allow="autoplay; encrypted-media"
                  title="Trailer Background"
                />
              </>
            ) : details.backdrop_path ? (
              <img
                src={backdropUrl(details.backdrop_path)}
                alt={details.title}
                className="w-full h-full object-cover object-top opacity-50"
              />
            ) : (
              <div className="w-full h-full bg-surface-light opacity-50" />
            )}
            <div className="absolute inset-0 bg-hero-overlay" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-bottom-fade" />
          </div>

          {/* Hero overlay content */}
          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-5 sm:pb-10">
              <div className="flex flex-row gap-3 sm:gap-8 items-end w-full">

                {/* Poster */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-16 sm:w-40 lg:w-56 shrink-0 rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10"
                >
                  {details.poster_path ? (
                    <img
                      src={posterUrl(details.poster_path, 'w342')}
                      alt={details.title}
                      className="w-full block"
                    />
                  ) : (
                    <div className="aspect-[2/3] bg-surface-light flex items-center justify-center">
                      <span className="text-2xl">🎬</span>
                    </div>
                  )}
                </motion.div>

                {/* Text info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 min-w-0 pb-1"
                >
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-1 sm:mb-2">
                    {details.genres?.slice(0, 2).map(g => (
                      <span
                        key={g.id}
                        className="badge bg-white/10 text-white border border-white/20 text-[9px] sm:text-xs"
                      >
                        {g.name}
                      </span>
                    ))}
                    <span className="badge bg-transparent border border-white/20 text-text-secondary text-[9px] sm:text-xs">
                      {details.release_date?.slice(0, 4)}
                    </span>
                    {details.runtime > 0 && (
                      <span className="badge bg-transparent border border-white/20 text-text-secondary text-[9px] sm:text-xs hidden sm:inline-flex">
                        {details.runtime} min
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="font-display font-bold text-xl sm:text-4xl lg:text-6xl text-white leading-tight mb-1 line-clamp-2">
                    {details.title}
                  </h1>

                  {/* Tagline — hidden on xs */}
                  {details.tagline && (
                    <p className="hidden sm:block text-sm sm:text-base text-text-secondary italic mb-3 sm:mb-4 line-clamp-1">
                      "{details.tagline}"
                    </p>
                  )}

                  {/* Rating + Director — hidden on xs, shown in body instead */}
                  <div className="hidden sm:flex flex-wrap items-center gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-accent-gold text-accent-gold" />
                      <div>
                        <p className="text-white font-bold text-base leading-none">
                          {details.vote_average?.toFixed(1)}
                          <span className="text-xs text-text-secondary font-normal">/10</span>
                        </p>
                        <p className="text-[10px] text-text-secondary">TMDB Rating</p>
                      </div>
                    </div>
                    {director && (
                      <div className="border-l border-white/10 pl-4">
                        <p className="text-white font-medium text-sm leading-none">{director.name}</p>
                        <p className="text-[10px] text-text-secondary">Director</p>
                      </div>
                    )}
                  </div>

                  {/* Action bar — hidden on xs, shown in body instead */}
                  <div className="hidden sm:flex flex-wrap items-center gap-2 sm:gap-3">
                    {trailerVideo && (
                      <button
                        onClick={() => { setTrailerOpen(true); recordView(details) }}
                        className="btn-primary"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Play Trailer
                      </button>
                    )}
                    <button
                      onClick={() => markWatched(details)}
                      disabled={watched}
                      className={`btn-secondary ${watched ? 'opacity-60 cursor-default border-accent-green text-accent-green' : ''}`}
                    >
                      <CheckCircle className={`w-4 h-4 ${watched ? 'fill-accent-green/20' : ''}`} />
                      {watched ? 'Watched' : 'Mark Watched'}
                    </button>
                    <div className="flex gap-2">
                      <ActionIcon
                        active={reaction === 'like'}
                        activeClass="bg-primary text-white border-transparent"
                        onClick={() => toggleReaction(details, 'like')}
                        title="Like"
                      >
                        <Heart className={`w-4 h-4 ${reaction === 'like' ? 'fill-current' : ''}`} />
                      </ActionIcon>
                      <ActionIcon
                        active={saved}
                        activeClass="bg-accent-green text-white border-transparent"
                        onClick={() => toggleWatchlist(details)}
                        title="Watchlist"
                      >
                        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </ActionIcon>
                    </div>
                    <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                      <span className="text-xs text-text-secondary">Rate:</span>
                      <StarRating value={myRating} onChange={v => rateMovie(details, v)} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile-only action panel (below hero) ────────────────────────── */}
        <div className="sm:hidden max-w-[1400px] mx-auto px-4 py-4 border-b border-white/5 space-y-3">
          {/* Rating + Director row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-accent-gold text-accent-gold" />
              <p className="text-white font-bold text-sm">
                {details.vote_average?.toFixed(1)}
                <span className="text-xs text-text-secondary font-normal">/10</span>
              </p>
            </div>
            {director && (
              <div className="border-l border-white/10 pl-4">
                <p className="text-white text-sm font-medium leading-none">{director.name}</p>
                <p className="text-[10px] text-text-secondary">Director</p>
              </div>
            )}
            {details.runtime > 0 && (
              <div className="border-l border-white/10 pl-4">
                <p className="text-white text-sm font-medium leading-none">{details.runtime} min</p>
                <p className="text-[10px] text-text-secondary">Runtime</p>
              </div>
            )}
          </div>

          {/* Tagline on mobile */}
          {details.tagline && (
            <p className="text-xs text-text-secondary italic line-clamp-2">"{details.tagline}"</p>
          )}

          {/* Action buttons on mobile */}
          <div className="flex flex-wrap gap-2">
            {trailerVideo && (
              <button
                onClick={() => { setTrailerOpen(true); recordView(details) }}
                className="btn-primary text-sm px-4 py-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Trailer
              </button>
            )}
            <button
              onClick={() => markWatched(details)}
              disabled={watched}
              className={`btn-secondary text-sm px-4 py-2 ${watched ? 'opacity-60 cursor-default border-accent-green text-accent-green' : ''}`}
            >
              <CheckCircle className={`w-4 h-4 ${watched ? 'fill-accent-green/20' : ''}`} />
              {watched ? 'Watched' : 'Mark Watched'}
            </button>
            <div className="flex gap-2">
              <ActionIcon
                active={reaction === 'like'}
                activeClass="bg-primary text-white border-transparent"
                onClick={() => toggleReaction(details, 'like')}
                title="Like"
              >
                <Heart className={`w-4 h-4 ${reaction === 'like' ? 'fill-current' : ''}`} />
              </ActionIcon>
              <ActionIcon
                active={saved}
                activeClass="bg-accent-green text-white border-transparent"
                onClick={() => toggleWatchlist(details)}
                title="Watchlist"
              >
                {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </ActionIcon>
            </div>
          </div>

          {/* Star rating on mobile */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">Your Rating:</span>
            <StarRating value={myRating} onChange={v => rateMovie(details, v)} />
          </div>
        </div>

        {/* ── Content Body ─────────────────────────────────────────────────── */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Overview */}
          <div className="mb-8 sm:mb-12">
            <h3 className="section-title">Overview</h3>
            <p className="text-text-secondary text-sm sm:text-base lg:text-lg leading-relaxed">
              {details.overview || 'No overview available.'}
            </p>
          </div>

          {/* Top Cast */}
          {credits?.cast?.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h3 className="section-title">Top Cast</h3>
              <div className="row-scroll">
                {credits.cast.slice(0, 10).map(actor => (
                  <CastCard key={actor.id} actor={actor} />
                ))}
              </div>
            </div>
          )}

          {/* Similar Movies */}
          {similar?.length > 0 && (
            <div className="mt-4">
              <MovieRow title="Similar Movies" movies={similar} />
            </div>
          )}
        </div>
      </div>

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoId={trailerVideo?.key}
        title={`${details.title} — Trailer`}
      />
    </PageTransition>
  )
}

const ActionIcon = ({ active, activeClass, onClick, children, title }) => (
  <button
    title={title}
    onClick={onClick}
    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
      active ? activeClass : 'border-white/20 text-text-secondary hover:text-white hover:border-white/40 bg-surface'
    }`}
  >
    {children}
  </button>
)
