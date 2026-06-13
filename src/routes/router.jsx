import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import App from '../App'
import ProtectedRoute from '../components/layout/ProtectedRoute'

import LandingPage from '../pages/Landing/LandingPage'
import LoginPage from '../pages/Auth/LoginPage'
import SignupPage from '../pages/Auth/SignupPage'
import GenrePickerPage from '../pages/Onboarding/GenrePickerPage'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import SearchResultsPage from '../pages/Search/SearchResultsPage'
import MovieDetailsPage from '../pages/MovieDetails/MovieDetailsPage'
import WatchlistPage from '../pages/Watchlist/WatchlistPage'
import ProfilePage from '../pages/Profile/ProfilePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthProvider><App /></AuthProvider>,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/onboarding/genres', element: <GenrePickerPage /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/search', element: <SearchResultsPage /> },
          { path: '/movie/:id', element: <MovieDetailsPage /> },
          { path: '/watchlist', element: <WatchlistPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ]
      },
      { path: '*', element: <div className="min-h-screen pt-32 text-center text-white">404 - Page Not Found</div> }
    ]
  }
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
