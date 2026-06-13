import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { updateFavoriteGenres } from '../../services/firestoreService'
import { GENRE_MAP } from '../../services/tmdbService'
import PageTransition from '../../components/layout/PageTransition'

const GENRE_LIST = Object.entries(GENRE_MAP).map(([id, name]) => ({ id: Number(id), name }))

export default function GenrePickerPage() {
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)

  const toggle = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    if (selected.length < 3 || !user) return
    setLoading(true)
    try {
      await updateFavoriteGenres(user.uid, selected)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              What do you like to watch?
            </h1>
            <p className="text-text-secondary text-lg">
              Pick at least 3 genres to personalize your recommendations.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {GENRE_LIST.map((genre) => {
              const isSelected = selected.includes(genre.id)
              return (
                <motion.button
                  key={genre.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggle(genre.id)}
                  className={`px-5 py-3 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                    isSelected 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-surface border-white/10 text-text-secondary hover:border-white/30 hover:text-white'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  {genre.name}
                </motion.button>
              )
            })}
          </motion.div>

          <div className="flex justify-center sticky bottom-6 z-10">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              disabled={selected.length < 3 || loading}
              onClick={handleSave}
              className="btn-primary w-full max-w-sm justify-center shadow-xl shadow-black/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : selected.length < 3 ? (
                `Pick ${3 - selected.length} more`
              ) : (
                'Start Watching'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
