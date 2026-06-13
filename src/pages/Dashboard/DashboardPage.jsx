import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import {
  useTrending, usePopular, useTopRated, useByGenre
} from '../../hooks/useTmdb'
import { useInteractions } from '../../hooks/useInteractions'
import { useRecommendations } from '../../hooks/useRecommendations'
import HeroBanner from '../../components/movie/HeroBanner'
import MovieRow from '../../components/movie/MovieRow'
import TrailerModal from '../../components/movie/TrailerModal'
import PageTransition from '../../components/layout/PageTransition'
import { getVideos } from '../../services/tmdbService'

export default function DashboardPage() {
  const [trailer, setTrailer] = useState(null)
  
  // Base queries
  const { data: trending, isLoading: loadTrending } = useTrending('day')
  const { data: popular, isLoading: loadPopular } = usePopular(1)
  const { data: topRated, isLoading: loadTopRated } = useTopRated(1)
  
  // Genre queries
  const { data: action, isLoading: loadAction } = useByGenre(28)
  const { data: comedy, isLoading: loadComedy } = useByGenre(35)
  const { data: thriller, isLoading: loadThriller } = useByGenre(53)
  const { data: scifi, isLoading: loadScifi } = useByGenre(878)

  const { continueWatching, removeContinueWatching } = useInteractions()
  const { items: recommendations, status: recsStatus, isStale, recompute } = useRecommendations()

  // Recompute recommendations if needed
  useEffect(() => {
    if (isStale && recsStatus !== 'loading') {
      recompute()
    }
  }, [isStale, recsStatus, recompute])

  const handlePlayTrailer = async (id) => {
    try {
      const vids = await getVideos(id)
      setTrailer(vids[0]?.key || null)
    } catch (_) {
      setTrailer(null)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        <HeroBanner
          movies={trending?.slice(0, 5)}
          onPlayTrailer={handlePlayTrailer}
        />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20 space-y-8 sm:space-y-12">

          {continueWatching.length > 0 && (
            <MovieRow
              title="Continue Watching"
              movies={continueWatching}
              isLoading={false}
              cardProps={{ compact: true, onRemove: removeContinueWatching }}
            />
          )}

          <MovieRow 
            title={recsStatus === 'loading' ? 'Generating your recommendations...' : 'For You'}
            movies={recommendations} 
            isLoading={recsStatus === 'loading'}
            showBadge={true}
          />

          <MovieRow title="Trending Now" movies={trending} isLoading={loadTrending} />
          <MovieRow title="Popular" movies={popular?.results} isLoading={loadPopular} />
          <MovieRow title="Top Rated" movies={topRated?.results} isLoading={loadTopRated} />
          <MovieRow title="Action Movies" movies={action?.results} isLoading={loadAction} />
          <MovieRow title="Comedies" movies={comedy?.results} isLoading={loadComedy} />
          <MovieRow title="Thrillers" movies={thriller?.results} isLoading={loadThriller} />
          <MovieRow title="Sci-Fi & Fantasy" movies={scifi?.results} isLoading={loadScifi} />
          
        </div>
      </div>

      <TrailerModal
        isOpen={trailer !== null}
        onClose={() => setTrailer(null)}
        videoId={trailer}
        title="Official Trailer"
      />
    </PageTransition>
  )
}
