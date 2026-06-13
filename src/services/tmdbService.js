// TMDB API — called directly (TMDB natively supports CORS, no proxy needed)
const BASE_URL = 'https://api.themoviedb.org/3'
const TOKEN = import.meta.env.VITE_TMDB_API_KEY

const buildUrl = (path, params = {}) => {
  if (!TOKEN) throw new Error('TMDB API key missing')
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', TOKEN)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return url.toString()
}

const fetcher = async (path, params = {}) => {
  const res = await fetch(buildUrl(path, params), {
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`)
  return res.json()
}

// ─── Image Helpers ─────────────────────────────────────────────────────────────
export const TMDB_KEY = TOKEN

// TMDB image CDN supports CORS natively — no proxy needed
const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const posterUrl   = (path, size = 'w500')     => path ? `${IMAGE_BASE}/${size}${path}` : null
export const backdropUrl = (path, size = 'original') => path ? `${IMAGE_BASE}/${size}${path}` : null
export const profileUrl  = (path, size = 'w185')     => path ? `${IMAGE_BASE}/${size}${path}` : null

// ─── Genre ID Map ──────────────────────────────────────────────────────────────
export const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 18: 'Drama', 14: 'Fantasy', 27: 'Horror',
  9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction', 53: 'Thriller',
  10751: 'Family', 36: 'History', 10752: 'War', 37: 'Western',
  10402: 'Music', 9648: 'Mystery', 99: 'Documentary', 10770: 'TV Movie'
}

// ─── API Functions ─────────────────────────────────────────────────────────────
export const getGenres = () => fetcher('/genre/movie/list')
  .then(d => d.genres)

export const getTrending = (window = 'week') => fetcher(`/trending/movie/${window}`)
  .then(d => d.results)

export const getPopular = (page = 1) => fetcher('/movie/popular', { page })
  .then(d => ({ results: d.results, totalPages: d.total_pages, page: d.page }))

export const getTopRated = (page = 1) => fetcher('/movie/top_rated', { page })
  .then(d => ({ results: d.results, totalPages: d.total_pages, page: d.page }))

export const getByGenre = (genreId, page = 1) => fetcher('/discover/movie', {
  with_genres: genreId, sort_by: 'popularity.desc', page
}).then(d => ({ results: d.results, totalPages: d.total_pages, page: d.page }))

export const getMovieDetails = (id) => fetcher(`/movie/${id}`)

export const getCredits = (id) => fetcher(`/movie/${id}/credits`)

export const getVideos = (id) => fetcher(`/movie/${id}/videos`)
  .then(d => d.results.filter(v => v.type === 'Trailer' && v.site === 'YouTube'))

export const getSimilar = (id, page = 1) => fetcher(`/movie/${id}/similar`, { page })
  .then(d => d.results)

export const getMovieRecommendations = (id, page = 1) => fetcher(`/movie/${id}/recommendations`, { page })
  .then(d => d.results)

export const getKeywords = (id) => fetcher(`/movie/${id}/keywords`)
  .then(d => d.keywords || [])

export const getNowPlaying = (page = 1) => fetcher('/movie/now_playing', { page })
  .then(d => d.results)

export const getUpcoming = (page = 1) => fetcher('/movie/upcoming', { page })
  .then(d => d.results)

// ─── Search ────────────────────────────────────────────────────────────────────
export const searchByTitle = (query, page = 1) => fetcher('/search/movie', { query, page })
  .then(d => ({ results: d.results, totalPages: d.total_pages, page: d.page }))

export const searchByActor = async (name) => {
  const people = await fetcher('/search/person', { query: name }).then(d => d.results)
  if (!people.length) return []
  const personId = people[0].id
  const movies = await fetcher('/discover/movie', { with_cast: personId, sort_by: 'popularity.desc' })
    .then(d => d.results)
  return movies.map(m => ({ ...m, matchType: 'actor', matchLabel: people[0].name }))
}

export const searchByKeyword = async (term) => {
  const keywords = await fetcher('/search/keyword', { query: term }).then(d => d.results)
  if (!keywords.length) return []
  const kwId = keywords[0].id
  const movies = await fetcher('/discover/movie', { with_keywords: kwId, sort_by: 'popularity.desc' })
    .then(d => d.results)
  return movies.map(m => ({ ...m, matchType: 'keyword', matchLabel: keywords[0].name }))
}

export const unifiedSearch = async (query) => {
  if (!query?.trim()) return { results: [], totalPages: 0 }

  const q = query.toLowerCase().trim()

  // Run all searches in parallel
  const [titleData, actorResults, keywordResults] = await Promise.allSettled([
    searchByTitle(query),
    searchByActor(query),
    searchByKeyword(query),
  ])

  const titleMovies = (titleData.status === 'fulfilled' ? titleData.value.results : [])
    .map(m => ({ ...m, matchType: 'title' }))
  const totalPages = titleData.status === 'fulfilled' ? titleData.value.totalPages : 1
  const actorMovies = actorResults.status === 'fulfilled' ? actorResults.value : []
  const kwMovies = keywordResults.status === 'fulfilled' ? keywordResults.value : []

  // Check genre match
  const genreMatch = Object.entries(GENRE_MAP).find(([, name]) =>
    name.toLowerCase().includes(q) || q.includes(name.toLowerCase())
  )
  let genreMovies = []
  if (genreMatch) {
    try {
      const gd = await getByGenre(Number(genreMatch[0]))
      genreMovies = gd.results.map(m => ({ ...m, matchType: 'genre', matchLabel: genreMatch[1] }))
    } catch (_) {}
  }

  // Merge and deduplicate
  const seen = new Set()
  const merged = [...titleMovies, ...actorMovies, ...kwMovies, ...genreMovies].filter(m => {
    if (seen.has(m.id)) return false
    seen.add(m.id)
    return true
  })

  return { results: merged, totalPages }
}

// ─── Batch fetch for details page ─────────────────────────────────────────────
export const getMovieDetailsAll = async (id) => {
  const [details, credits, videos, similar] = await Promise.all([
    getMovieDetails(id),
    getCredits(id),
    getVideos(id),
    getSimilar(id),
  ])
  return { details, credits, videos, similar }
}
