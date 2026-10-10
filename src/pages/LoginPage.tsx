import { Eye, EyeOff } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getApiError } from '../lib/http'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!email || !password) {
      toast.error('Email and password are required')
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(getApiError(error, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-line p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Use your Route e-commerce account.</p>
        <label className="mt-6 block text-sm font-medium">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Password
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <div className="mt-2 text-right">
          <Link to="/forgot-password" className="text-sm text-brand">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-brand py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          New here?{' '}
          <Link to="/register" state={{ from }} className="font-medium text-brand">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}
