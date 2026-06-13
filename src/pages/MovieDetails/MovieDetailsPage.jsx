import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

  // Track view when details load
  useEffect(() => {
    if (data?.details) {
      recordView(data.details)
    }
  }, [data?.details?.id, recordView])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="w-full h-[70vh] skeleton" />
      </div>
    )
  }

  if (!data?.details) {
    return <div className="min-h-screen flex items-center justify-center pt-20 text-white">Movie not found</div>
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
        {/* Backdrop Header */}
        <div className="relative w-full h-[50vh] sm:h-[70vh]">
          <div className="absolute inset-0">
            {details.backdrop_path ? (
              <img
                src={backdropUrl(details.backdrop_path)}
                alt={details.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-surface-light" />
            )}
            <div className="absolute inset-0 bg-hero-overlay" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-bottom-fade" />
          </div>

          <div className="absolute inset-0 pt-20">
            <div className="max-w-[1400px] mx-auto px-6 h-full flex items-end pb-8">
              <div className="flex flex-col md:flex-row gap-8 items-end md:items-stretch relative z-10 w-full">
                {/* Poster - hidden on small mobile, shown on tablet up */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hidden sm:block w-48 lg:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
                >
                  <img src={posterUrl(details.poster_path, 'w500')} alt={details.title} className="w-full" />
                </motion.div>

                {/* Info */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 pb-2"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {details.genres?.map(g => (
                      <span key={g.id} className="badge bg-white/10 text-white border border-white/20">
                        {g.name}
                      </span>
                    ))}
                    <span className="badge bg-transparent border border-white/20 text-text-secondary">
                      {details.release_date?.slice(0, 4)}
                    </span>
                    <span className="badge bg-transparent border border-white/20 text-text-secondary">
                      {details.runtime} min
                    </span>
                  </div>

                  <h1 className="font-display font-bold text-4xl lg:text-6xl text-white mb-2 leading-tight">
                    {details.title}
                  </h1>

                  {details.tagline && (
                    <p className="text-xl text-text-secondary italic mb-6">"{details.tagline}"</p>
                  )}

                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 fill-accent-gold text-accent-gold" />
                      <div>
                        <p className="text-white font-bold text-lg leading-none">{details.vote_average?.toFixed(1)}<span className="text-sm text-text-secondary font-normal">/10</span></p>
                        <p className="text-xs text-text-secondary">TMDB Rating</p>
                      </div>
                    </div>
                    {director && (
                      <div className="border-l border-white/10 pl-6">
                        <p className="text-white font-medium leading-none">{director.name}</p>
                        <p className="text-xs text-text-secondary">Director</p>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    {trailerVideo && (
                      <button 
                        onClick={() => {
                          setTrailerOpen(true)
                          recordView(details)
                        }} 
                        className="btn-primary"
                      >
                        <Play className="w-5 h-5 fill-white" />
                        Play Trailer
                      </button>
                    )}

                    <button 
                      onClick={() => markWatched(details)}
                      disabled={watched}
                      className={`btn-secondary ${watched ? 'opacity-50 cursor-default border-accent-green text-accent-green' : ''}`}
                    >
                      <CheckCircle className={`w-5 h-5 ${watched ? 'fill-accent-green/20' : ''}`} />
                      {watched ? 'Watched' : 'Mark as Watched'}
                    </button>

                    <div className="flex gap-2 ml-1">
                      <ActionIcon 
                        active={reaction === 'like'} 
                        activeClass="bg-primary text-white border-transparent"
                        onClick={() => toggleReaction(details, 'like')}
                        title="Like"
                      >
                        <Heart className={`w-5 h-5 ${reaction === 'like' ? 'fill-current' : ''}`} />
                      </ActionIcon>
                      <ActionIcon 
                        active={saved} 
                        activeClass="bg-accent-green text-white border-transparent"
                        onClick={() => toggleWatchlist(details)}
                        title="Watchlist"
                      >
                        {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </ActionIcon>
                    </div>

                    <div className="ml-4 pl-4 border-l border-white/10 flex items-center gap-3">
                      <span className="text-sm text-text-secondary">Rate:</span>
                      <StarRating value={myRating} onChange={(v) => rateMovie(details, v)} />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h3 className="section-title">Overview</h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-12">
                {details.overview}
              </p>

              {credits?.cast?.length > 0 && (
                <div className="mb-12">
                  <h3 className="section-title">Top Cast</h3>
                  <div className="row-scroll">
                    {credits.cast.slice(0, 10).map(actor => (
                      <CastCard key={actor.id} actor={actor} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {similar?.length > 0 && (
            <div className="mt-8">
              <MovieRow title="Similar Movies" movies={similar} />
            </div>
          )}
        </div>
      </div>

      <TrailerModal 
        isOpen={trailerOpen} 
        onClose={() => setTrailerOpen(false)} 
        videoId={trailerVideo?.key}
        title={`${details.title} - Trailer`} 
      />
    </PageTransition>
  )
}

const ActionIcon = ({ active, activeClass, onClick, children, title }) => (
  <button
    title={title}
    onClick={onClick}
    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${
      active ? activeClass : 'border-white/20 text-text-secondary hover:text-white hover:border-white/40 bg-surface'
    }`}
  >
    {children}
  </button>
)
