import { useInteractions } from '../../hooks/useInteractions'
import { Bookmark } from 'lucide-react'
import MovieCard from '../../components/movie/MovieCard'
import PageTransition from '../../components/layout/PageTransition'

export default function WatchlistPage() {
  const { watchlist } = useInteractions()

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 border-b border-white/10 pb-6">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-primary" />
              My Watchlist
            </h1>
            <p className="text-text-secondary mt-2 text-sm">
              {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved
            </p>
          </div>

          {watchlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {watchlist.map((movie) => (
                <MovieCard key={movie.movieId} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-white/10 rounded-2xl">
              <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-text-secondary opacity-50" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h2>
              <p className="text-text-secondary max-w-sm">
                Movies you add to your watchlist will appear here. Start exploring to find your next favorite movie!
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
