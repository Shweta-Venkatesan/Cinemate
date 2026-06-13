import React, { createContext, useContext, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
} from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase'
import {
  createOrUpdateUser, getUser, deleteUserData
} from '../services/firestoreService'
import { useDispatch } from 'react-redux'
import { setUser, clearAuth } from '../store/authSlice'
import { clearInteractions } from '../store/interactionsSlice'
import { clearRecommendations } from '../store/recommendationsSlice'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Movie Fan',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || null,
        }
        dispatch(setUser(profile))
      } else {
        dispatch(clearAuth())
        dispatch(clearInteractions())
        dispatch(clearRecommendations())
      }
    })
    return unsub
  }, [dispatch])

  const signUpWithEmail = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    await createOrUpdateUser(cred.user.uid, {
      uid: cred.user.uid,
      displayName,
      email,
      photoURL: null,
      provider: 'password',
      favoriteGenres: [],
      preferences: { autoplayTrailers: false, recommendationOptOutGenres: [] },
      stats: { totalRatings: 0, totalWatched: 0 },
      createdAt: new Date(),
    })
    return cred.user
  }

  const signInWithEmail = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    await createOrUpdateUser(cred.user.uid, {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || 'Movie Fan',
      photoURL: cred.user.photoURL || null,
    })
    return cred.user
  }

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider)
    const existing = await getUser(cred.user.uid)
    await createOrUpdateUser(cred.user.uid, {
      uid: cred.user.uid,
      displayName: cred.user.displayName,
      email: cred.user.email,
      photoURL: cred.user.photoURL,
      provider: 'google',
      ...(!existing ? {
        favoriteGenres: [],
        preferences: { autoplayTrailers: false, recommendationOptOutGenres: [] },
        stats: { totalRatings: 0, totalWatched: 0 },
        createdAt: new Date(),
      } : {}),
    })
    return { user: cred.user, isNew: !existing }
  }

  const signOutUser = async () => {
    await signOut(auth)
  }

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email)
  }

  const deleteAccount = async (uid) => {
    await deleteUserData(uid)
    await deleteUser(auth.currentUser)
  }

  return (
    <AuthContext.Provider value={{
      signUpWithEmail, signInWithEmail, signInWithGoogle,
      signOutUser, resetPassword, deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
