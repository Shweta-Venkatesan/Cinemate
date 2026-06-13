import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Play, Sparkles, Database, Layout, Smartphone } from 'lucide-react'
import { useTrending } from '../../hooks/useTmdb'
import MovieRow from '../../components/movie/MovieRow'
import PageTransition from '../../components/layout/PageTransition'

export default function LandingPage() {
  const { user } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const { data: trendingMovies, isLoading } = useTrending('week')

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          
          <div className="relative max-w-[1400px] mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-light border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-text-primary tracking-wide uppercase">AI-Powered Recommendations</span>
              </div>
              
              <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6 tracking-tight leading-tight">
                Discover your next <br className="hidden md:block" />
                <span className="text-gradient">favorite movie.</span>
              </h1>
              
              <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                CineMind AI learns your unique taste to recommend movies you'll actually love. 
                Stop scrolling endlessly and start watching.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup" className="btn-primary w-full sm:w-auto px-8 py-4 text-lg justify-center shadow-lg shadow-primary/20">
                  Get Started for Free
                </Link>
                <Link to="/login" className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg justify-center">
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trending Preview */}
        <section className="max-w-[1400px] mx-auto px-6 py-12 relative z-10 -mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-6"
          >
            <MovieRow 
              title="Trending This Week" 
              movies={trendingMovies?.slice(0, 10)} 
              isLoading={isLoading} 
            />
          </motion.div>
        </section>

        {/* Features Showcase */}
        <section className="max-w-[1400px] mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Built for Movie Lovers</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Everything you need to track, discover, and organize your cinematic journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-primary" />}
              title="Smart AI Engine"
              desc="Our content-based filtering algorithm analyzes your watch history and likes to find hidden gems."
            />
            <FeatureCard 
              icon={<Database className="w-6 h-6 text-accent-green" />}
              title="Massive Catalog"
              desc="Powered by TMDB, access details, trailers, and cast information for millions of movies."
            />
            <FeatureCard 
              icon={<Layout className="w-6 h-6 text-accent-gold" />}
              title="Track Everything"
              desc="Keep a detailed log of what you've watched, what you want to watch, and how you rate them."
            />
          </div>
        </section>

        {/* Explainer Section */}
        <section className="bg-surface py-24">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  How CineMind learns <br/>your taste
                </h2>
                <div className="space-y-6">
                  <Step num="1" title="Tell us what you like" desc="Start by picking a few of your favorite genres." />
                  <Step num="2" title="Interact with movies" desc="Like, rate, and add movies to your watchlist as you browse." />
                  <Step num="3" title="Get personalized picks" desc="Our engine builds a unique profile vector to match you with similar movies." />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                <div className="glass-dark border-white/10 p-8 relative rounded-2xl shadow-2xl overflow-hidden">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center bg-surface p-4 rounded-xl opacity-80">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">👍</div>
                      <div>
                        <div className="h-2 w-24 bg-white/20 rounded mb-2" />
                        <div className="h-2 w-16 bg-white/10 rounded" />
                      </div>
                    </div>
                    <div className="flex justify-center py-2">
                      <div className="w-px h-8 bg-gradient-to-b from-white/20 to-primary" />
                    </div>
                    <div className="bg-primary/20 border border-primary/30 p-6 rounded-xl text-center">
                      <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                      <p className="font-semibold text-white">Generating "For You" Row...</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-8 rounded-2xl text-center border-t border-t-white/10"
  >
    <div className="w-14 h-14 mx-auto bg-surface rounded-2xl flex items-center justify-center mb-6 shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-text-secondary leading-relaxed">{desc}</p>
  </motion.div>
)

const Step = ({ num, title, desc }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 shrink-0 rounded-full bg-surface-light border border-white/10 flex items-center justify-center font-display font-bold text-primary">
      {num}
    </div>
    <div>
      <h4 className="text-lg font-semibold text-white mb-1">{title}</h4>
      <p className="text-text-secondary">{desc}</p>
    </div>
  </div>
)
