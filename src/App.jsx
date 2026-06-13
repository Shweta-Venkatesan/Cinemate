import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ToastContainer from './components/ui/Toast'
import { getWatchHistory, getLikedMovies, getWatchlist, getRatings, getRecommendations } from './services/firestoreService'
import { setInteractions, setStatus } from './store/interactionsSlice'
import { setRecommendations } from './store/recommendationsSlice'

function AppLayout() {
  const location = useLocation()
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary selection:bg-primary/30">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const { user, authLoading } = useSelector(s => s.auth)
  const interactionsStatus = useSelector(s => s.interactions.status)

  useEffect(() => {
    if (!user || authLoading) return

    const loadUserData = async () => {
      dispatch(setStatus('loading'))
      try {
        const [watchHistory, likedMovies, watchlist, ratings, recommendations] = await Promise.all([
          getWatchHistory(user.uid),
          getLikedMovies(user.uid),
          getWatchlist(user.uid),
          getRatings(user.uid),
          getRecommendations(user.uid)
        ])

        dispatch(setInteractions({ watchHistory, likedMovies, watchlist, ratings }))
        
        if (recommendations) {
          dispatch(setRecommendations(recommendations))
        }
      } catch (err) {
        console.error('Failed to load user data:', err)
        dispatch(setStatus('error'))
      }
    }

    if (interactionsStatus === 'idle') {
      loadUserData()
    }
  }, [user, authLoading, interactionsStatus, dispatch])

  return <AppLayout />
}
