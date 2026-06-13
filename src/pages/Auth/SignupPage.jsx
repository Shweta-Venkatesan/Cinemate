import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Film, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import PageTransition from '../../components/layout/PageTransition'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function SignupPage() {
  const navigate = useNavigate()
  const { signUpWithEmail, signInWithGoogle } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
    try {
      setError('')
      setLoading(true)
      await signUpWithEmail(data.email, data.password, data.name)
      navigate('/onboarding/genres')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.')
      } else {
        setError('Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      setError('')
      setLoading(true)
      const { isNew } = await signInWithGoogle()
      if (isNew) {
        navigate('/onboarding/genres')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Failed to sign in with Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <Link to="/" className="flex justify-center items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Film className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-3xl text-white">Cine<span className="text-primary">Mind</span></span>
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold text-text-primary tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Join CineMind to start getting personalized recommendations.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="glass-dark py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/5">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Full Name"
                    className="input-field pl-10 bg-black/30 border-white/5 focus:bg-surface-light"
                  />
                </div>
                {errors.name && <p className="mt-1.5 text-xs text-red-400 pl-1">{errors.name.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="Email address"
                    className="input-field pl-10 bg-black/30 border-white/5 focus:bg-surface-light"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-400 pl-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="Password"
                    className="input-field pl-10 bg-black/30 border-white/5 focus:bg-surface-light"
                  />
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-400 pl-1">{errors.password.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Confirm password"
                    className="input-field pl-10 bg-black/30 border-white/5 focus:bg-surface-light"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400 pl-1">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center disabled:opacity-70 mt-2"
              >
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign up'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface-light text-text-secondary rounded-full">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/10 rounded-lg shadow-sm bg-white/5 text-sm font-medium text-white hover:bg-white/10 transition-colors disabled:opacity-70"
                >
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-white hover:text-primary transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
