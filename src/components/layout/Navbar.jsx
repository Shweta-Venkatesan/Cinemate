import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '../../context/AuthContext'
import {
  Search, Film, Bookmark, User, LogOut, ChevronDown, Bell, Menu, X
} from 'lucide-react'

export default function Navbar() {
  const { user } = useSelector(s => s.auth)
  const { signOutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileOpen(false)
    }
  }

  const handleSignOut = async () => {
    await signOutUser()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen ? 'bg-surface shadow-lg shadow-black/30 border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl text-white hidden sm:block">
              Cine<span className="text-primary">Mind</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/dashboard" active={isActive('/dashboard')}>Home</NavLink>
              <NavLink to="/search" active={isActive('/search')}>Discover</NavLink>
              <NavLink to="/watchlist" active={isActive('/watchlist')}>My List</NavLink>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Desktop Search */}
                <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-surface-light/80 border border-white/10 rounded-full px-4 py-1.5">
                  <Search className="w-4 h-4 text-text-secondary" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="bg-transparent text-sm text-text-primary placeholder-text-secondary outline-none w-40 focus:w-56 transition-all duration-300"
                  />
                </form>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 hover:bg-white/10 rounded-full pr-2 pl-1 py-1 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-primary/50 flex items-center justify-center overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold text-sm">
                          {user.displayName?.[0]?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-xl overflow-hidden shadow-xl shadow-black/50 animate-scaleIn">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-text-primary truncate">{user.displayName}</p>
                        <p className="text-xs text-text-secondary truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <DropItem to="/profile" icon={<User className="w-4 h-4" />} label="Profile" onClick={() => setDropdownOpen(false)} />
                        <DropItem to="/watchlist" icon={<Bookmark className="w-4 h-4" />} label="My Watchlist" onClick={() => setDropdownOpen(false)} />
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2 px-4">Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-4 animate-fadeIn">
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-surface-light border border-white/10 rounded-lg px-4 py-2 mb-3">
              <Search className="w-4 h-4 text-text-secondary shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="bg-transparent text-sm text-text-primary placeholder-text-secondary outline-none flex-1"
              />
            </form>
            <div className="space-y-1">
              <MobileNavLink to="/dashboard" onClick={() => setMobileOpen(false)}>🏠 Home</MobileNavLink>
              <MobileNavLink to="/search" onClick={() => setMobileOpen(false)}>🔍 Discover</MobileNavLink>
              <MobileNavLink to="/watchlist" onClick={() => setMobileOpen(false)}>🔖 My List</MobileNavLink>
              <MobileNavLink to="/profile" onClick={() => setMobileOpen(false)}>👤 Profile</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active ? 'text-white bg-white/10' : 'text-text-secondary hover:text-white hover:bg-white/5'
    }`}
  >
    {children}
  </Link>
)

const DropItem = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors duration-150"
  >
    {icon}
    {label}
  </Link>
)

const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-3 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-150 text-sm font-medium"
  >
    {children}
  </Link>
)
