import { useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Search } from 'lucide-react'
import { useUnifiedSearch, usePopular } from '../../hooks/useTmdb'
import { addSearchHistory } from '../../services/firestoreService'
import MovieCard from '../../components/movie/MovieCard'
import { SkeletonGrid } from '../../components/ui/SkeletonCard'
import PageTransition from '../../components/layout/PageTransition'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { data, isLoading } = useUnifiedSearch(query)
  const { data: discoverData, isLoading: isDiscoverLoading } = usePopular(1)
  const { user } = useSelector(s => s.auth)
  const loggedRef = useRef(new Set())

  // Log search history (debounced naturally by the fact it only runs on valid query mount)
  useEffect(() => {
    if (user && query.length > 2 && data?.results && !loggedRef.current.has(query)) {
      loggedRef.current.add(query)
      addSearchHistory(user.uid, {
        query,
        matchType: data.results[0]?.matchType || 'title',
        resultCount: data.results.length
      }).catch(console.error)
    }
  }, [query, data, user])

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 border-b border-white/10 pb-6">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-3">
              <Search className="w-6 h-6 text-primary" />
              {query ? (
                <span>Results for <span className="text-primary">"{query}"</span></span>
              ) : (
                'Search Movies'
              )}
            </h1>
            {data?.results && (
              <p className="text-text-secondary mt-2 text-sm">Found {data.results.length} results</p>
            )}
          </div>

          {!query ? (
            <div className="py-8">
              <div className="flex flex-col items-center justify-center py-10 text-center border-b border-white/10 mb-8">
                <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-text-secondary opacity-50" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Discover something new</h2>
                <p className="text-text-secondary max-w-md">Try searching for a movie title, an actor like "Tom Hardy", or a genre like "Sci-Fi".</p>
              </div>
              <h3 className="text-xl font-bold text-white mb-6">Popular Right Now</h3>
              {isDiscoverLoading ? (
                <SkeletonGrid count={18} />
              ) : discoverData?.results?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                  {discoverData.results.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} showBadge={true} compact={false} />
                  ))}
                </div>
              ) : null}
            </div>
          ) : isLoading ? (
            <SkeletonGrid count={18} />
          ) : data?.results?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {data.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} showBadge={true} compact={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-text-primary mb-2">No results found</p>
              <p className="text-text-secondary">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
