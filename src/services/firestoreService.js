import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, query, orderBy, limit, startAfter,
  serverTimestamp, increment, writeBatch
} from 'firebase/firestore'
import { db } from './firebase'

// ─── User Profile ──────────────────────────────────────────────────────────────
export const createOrUpdateUser = async (uid, data) => {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, { ...data, lastLoginAt: serverTimestamp() }, { merge: true })
}

export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), data)
}

export const updateFavoriteGenres = async (uid, genreIds) => {
  await updateDoc(doc(db, 'users', uid), { favoriteGenres: genreIds })
}

// ─── Watch History ─────────────────────────────────────────────────────────────
export const upsertWatchHistory = async (uid, movie) => {
  const ref = doc(db, 'users', uid, 'watchHistory', String(movie.movieId))
  const snap = await getDoc(ref)
  if (snap.exists()) {
    await updateDoc(ref, { lastViewedAt: serverTimestamp() })
  } else {
    await setDoc(ref, {
      ...movie,
      firstViewedAt: serverTimestamp(),
      lastViewedAt: serverTimestamp(),
      completed: false,
      completedAt: null,
    })
  }
}

export const markAsWatched = async (uid, movieId) => {
  const ref = doc(db, 'users', uid, 'watchHistory', String(movieId))
  await updateDoc(ref, { completed: true, completedAt: serverTimestamp() })
  await updateDoc(doc(db, 'users', uid), { 'stats.totalWatched': increment(1) })
}

export const getWatchHistory = async (uid) => {
  const q = query(collection(db, 'users', uid, 'watchHistory'), orderBy('lastViewedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

// ─── Liked Movies ──────────────────────────────────────────────────────────────
export const setReaction = async (uid, movie, reaction) => {
  const ref = doc(db, 'users', uid, 'likedMovies', String(movie.movieId))
  if (reaction === null) {
    await deleteDoc(ref)
  } else {
    await setDoc(ref, { ...movie, reaction, reactedAt: serverTimestamp() })
  }
}

export const getLikedMovies = async (uid) => {
  const snap = await getDocs(collection(db, 'users', uid, 'likedMovies'))
  return snap.docs.map(d => d.data())
}

// ─── Watchlist ─────────────────────────────────────────────────────────────────
export const addToWatchlist = async (uid, movie) => {
  const ref = doc(db, 'users', uid, 'watchlist', String(movie.movieId))
  await setDoc(ref, { ...movie, addedAt: serverTimestamp() })
}

export const removeFromWatchlist = async (uid, movieId) => {
  await deleteDoc(doc(db, 'users', uid, 'watchlist', String(movieId)))
}

export const getWatchlist = async (uid) => {
  const q = query(collection(db, 'users', uid, 'watchlist'), orderBy('addedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

// ─── Ratings ───────────────────────────────────────────────────────────────────
export const setRating = async (uid, movie, rating) => {
  const ref = doc(db, 'users', uid, 'ratings', String(movie.movieId))
  const snap = await getDoc(ref)
  await setDoc(ref, { ...movie, rating, ratedAt: serverTimestamp() })
  if (!snap.exists()) {
    await updateDoc(doc(db, 'users', uid), { 'stats.totalRatings': increment(1) })
  }
}

export const getRatings = async (uid) => {
  const snap = await getDocs(collection(db, 'users', uid, 'ratings'))
  return snap.docs.map(d => d.data())
}

// ─── Search History ────────────────────────────────────────────────────────────
export const addSearchHistory = async (uid, { query: q, matchType, resultCount }) => {
  await addDoc(collection(db, 'users', uid, 'searchHistory'), {
    query: q, matchType, resultCount, searchedAt: serverTimestamp()
  })
}

export const getSearchHistory = async (uid) => {
  const qr = query(collection(db, 'users', uid, 'searchHistory'), orderBy('searchedAt', 'desc'), limit(50))
  const snap = await getDocs(qr)
  return snap.docs.map(d => d.data())
}

// ─── Recommendations ───────────────────────────────────────────────────────────
export const saveRecommendations = async (uid, data) => {
  await setDoc(doc(db, 'users', uid, 'recommendations', 'current'), {
    ...data,
    generatedAt: serverTimestamp(),
  })
}

export const getRecommendations = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid, 'recommendations', 'current'))
  return snap.exists() ? snap.data() : null
}

// ─── Delete Account ────────────────────────────────────────────────────────────
export const deleteUserData = async (uid) => {
  const subcollections = ['watchHistory', 'likedMovies', 'watchlist', 'ratings', 'searchHistory', 'recommendations']
  const batch = writeBatch(db)
  for (const sub of subcollections) {
    const snap = await getDocs(collection(db, 'users', uid, sub))
    snap.docs.forEach(d => batch.delete(d.ref))
  }
  batch.delete(doc(db, 'users', uid))
  await batch.commit()
}
