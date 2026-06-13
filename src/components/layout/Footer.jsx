import { Film, Github, Twitter, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 mt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Cine<span className="text-primary">Mind</span> AI
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Discover movies personalized to your taste using AI-powered content-based filtering. Every recommendation is uniquely yours.
            </p>
            {/* TMDB Attribution - Required */}
            <div className="mt-4 flex items-center gap-3 p-3 bg-surface-light rounded-lg border border-white/5">
              <div className="w-10 h-10 bg-[#01D277]/20 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[#01D277] font-bold text-xs">TMDB</span>
              </div>
              <p className="text-xs text-text-secondary leading-tight">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Browse</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/dashboard', 'Dashboard'], ['/search', 'Discover'], ['/watchlist', 'My List']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-text-secondary hover:text-white text-sm transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2">
              {[['/login', 'Sign In'], ['/signup', 'Sign Up'], ['/profile', 'Profile'], ['/profile', 'Settings']].map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="text-text-secondary hover:text-white text-sm transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-xs">
            © {new Date().getFullYear()} CineMind AI. Built for portfolio & educational purposes only.
          </p>
          <div className="flex items-center gap-3">
            {[Github, Twitter, Instagram].map((Icon, i) => (
              <button key={i} className="w-8 h-8 rounded-full bg-surface-light hover:bg-white/10 flex items-center justify-center transition-colors duration-150">
                <Icon className="w-4 h-4 text-text-secondary" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
