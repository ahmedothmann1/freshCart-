import { type FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getApiError } from '../lib/http'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/'
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (form.password !== form.rePassword) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(getApiError(error, 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-line p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Create account</h1>
        <label className="block text-sm font-medium">
          Full name
          <input required value={form.name} onChange={(e) => set('name', e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="block text-sm font-medium">
          Phone
          <input required value={form.phone} onChange={(e) => set('phone', e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input type="password" required value={form.password} onChange={(e) => set('password', e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="block text-sm font-medium">
          Confirm password
          <input type="password" required value={form.rePassword} onChange={(e) => set('rePassword', e.target.value)} className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand py-3 font-semibold text-white disabled:opacity-60">
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" state={{ from }} className="text-brand">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
