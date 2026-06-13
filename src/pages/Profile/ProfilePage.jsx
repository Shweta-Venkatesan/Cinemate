import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { User, Settings, ShieldAlert, Sparkles, Activity, Star, History, ThumbsUp, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useInteractions } from '../../hooks/useInteractions'
import { useRecommendations } from '../../hooks/useRecommendations'
import { GENRE_MAP } from '../../services/tmdbService'
import PageTransition from '../../components/layout/PageTransition'
import Tabs from '../../components/ui/Tabs'
import Modal from '../../components/ui/Modal'

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth)
  const { deleteAccount, signOutUser } = useAuth()
  const navigate = useNavigate()
  const { watchHistory, likedMovies, ratings } = useInteractions()
  const { basis } = useRecommendations()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [password, setPassword] = useState('')

  // Detect provider: email/password users must re-enter password; Google users get a popup
  const isEmailUser = user?.providerData?.[0]?.providerId === 'password'

  if (!user) return null

  const watchedCount = watchHistory.filter(m => m.completed).length
  const likedCount = likedMovies.filter(m => m.reaction === 'like').length

  const tabs = [
    {
      id: 'insights',
      label: 'Recommendation Insights',
      content: (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass p-6">
            <h3 className="flex items-center gap-2 font-display font-bold text-lg text-white mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              Why am I seeing these recommendations?
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              Your "For You" row is uniquely generated based on your past interactions. 
              The engine currently weighs these factors most heavily for your profile:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface-light rounded-xl p-5 border border-white/5">
                <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">Top Driving Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {basis?.topGenres?.length > 0 ? (
                    basis.topGenres.map(id => (
                      <span key={id} className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {GENRE_MAP[id] || 'Unknown'}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-text-secondary">Not enough data yet</span>
                  )}
                </div>
              </div>
              
              <div className="bg-surface-light rounded-xl p-5 border border-white/5">
                <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">Seed Movies</h4>
                <div className="flex flex-col gap-2">
                  {basis?.seedMovieIds?.length > 0 ? (
                    basis.seedMovieIds.map(id => {
                      const m = [...watchHistory, ...likedMovies].find(x => x.movieId === id)
                      return m ? (
                        <div key={id} className="flex items-center gap-3 bg-black/20 rounded-lg p-2">
                          {m.posterPath ? (
                            <img src={`https://image.tmdb.org/t/p/w92${m.posterPath}`} className="w-8 h-12 object-cover rounded" alt="" />
                          ) : <div className="w-8 h-12 bg-white/10 rounded" />}
                          <span className="text-sm text-white line-clamp-1">{m.title}</span>
                        </div>
                      ) : null
                    })
                  ) : (
                    <span className="text-sm text-text-secondary">Interact with more movies to see insights</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'history',
      label: 'Watch History',
      content: (
        <div className="space-y-3 animate-fadeIn">
          {watchHistory.length > 0 ? (
            watchHistory.map(movie => (
              <div key={movie.movieId} className="flex items-center gap-4 glass p-3">
                {movie.posterPath ? (
                  <img src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`} className="w-12 h-18 object-cover rounded shadow-md" alt="" />
                ) : <div className="w-12 h-18 bg-white/10 rounded" />}
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm md:text-base">{movie.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs ${movie.completed ? 'text-accent-green' : 'text-text-secondary'}`}>
                      {movie.completed ? '✅ Watched' : '🕒 In progress'}
                    </span>
                    <span className="text-xs text-text-secondary">
                      Last viewed: {new Date(movie.lastViewedAt?.toMillis?.() || movie.lastViewedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-text-secondary text-center py-8">Your watch history is empty.</p>
          )}
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Account Settings',
      content: (
        <div className="space-y-6 animate-fadeIn">
          <div className="glass p-6 border-red-500/30">
            <h3 className="flex items-center gap-2 font-display font-bold text-lg text-red-400 mb-2">
              <ShieldAlert className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              Permanently delete your account and all associated interaction data (history, ratings, watchlist). This action cannot be undone.
            </p>
            <button 
              onClick={() => setDeleteModalOpen(true)}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-semibold transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      )
    }
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1000px] mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-12 bg-surface p-8 rounded-2xl border border-white/5 shadow-xl">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/20 border-4 border-surface-light flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-primary/10">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-display font-bold text-white mb-1">{user.displayName}</h1>
              <p className="text-text-secondary text-sm mb-6">{user.email} • Joined {new Date(user.metadata?.creationTime || Date.now()).getFullYear()}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <StatBadge icon={<History />} label="Watched" value={watchedCount} color="blue" />
                <StatBadge icon={<ThumbsUp />} label="Liked" value={likedCount} color="green" />
                <StatBadge icon={<Star />} label="Ratings" value={ratings.length} color="gold" />
              </div>
            </div>
          </div>

          <Tabs tabs={tabs} defaultTab="insights" />
        </div>
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setDeleteError(''); setPassword('') }} title="Delete Account">
        <div className="p-6">
          <p className="text-text-secondary mb-4 leading-relaxed">
            Are you sure? All your watch history, ratings, watchlist, and recommendations will be <strong className="text-white">permanently erased</strong>. This cannot be undone.
          </p>

          {/* Email users must re-enter password */}
          {isEmailUser && (
            <div className="mb-4">
              <label className="text-sm text-text-secondary block mb-1.5">Confirm your password to continue</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your current password"
                className="input-field"
                disabled={isDeleting}
              />
            </div>
          )}

          {deleteError && (
            <div className="mb-4 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{deleteError}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setDeleteModalOpen(false); setDeleteError(''); setPassword('') }}
              className="btn-ghost"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              disabled={isDeleting || (isEmailUser && !password)}
              onClick={async () => {
                setDeleteError('')
                setIsDeleting(true)
                try {
                  await deleteAccount(user.uid, password)
                  // Auth state listener will clear Redux store automatically
                  navigate('/', { replace: true })
                } catch (err) {
                  console.error('Delete failed:', err)
                  if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                    setDeleteError('Incorrect password. Please try again.')
                  } else if (err.code === 'auth/too-many-requests') {
                    setDeleteError('Too many failed attempts. Please try again later.')
                  } else if (err.code === 'auth/popup-closed-by-user') {
                    setDeleteError('Sign-in popup was closed. Please try again.')
                  } else {
                    setDeleteError(err.message || 'Failed to delete account. Please try again.')
                  }
                  setIsDeleting(false)
                }
              }}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  )
}

const StatBadge = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    gold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  }
  
  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${colors[color]}`}>
      <div className="w-5 h-5 opacity-80">{icon}</div>
      <div className="flex flex-col items-start">
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">{label}</span>
        <span className="text-lg font-display font-bold leading-none mt-0.5">{value}</span>
      </div>
    </div>
  )
}
