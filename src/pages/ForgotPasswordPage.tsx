import { type FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { getApiError } from '../lib/http'
import { authService } from '../services/auth.service'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onEmail(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      toast.success('Reset code sent to your email')
      setStep(2)
    } catch (error) {
      toast.error(getApiError(error))
    } finally {
      setLoading(false)
    }
  }

  async function onCode(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      await authService.verifyResetCode(resetCode)
      toast.success('Code verified')
      setStep(3)
    } catch (error) {
      toast.error(getApiError(error, 'Invalid reset code'))
    } finally {
      setLoading(false)
    }
  }

  async function onReset(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      await authService.resetPassword({ email, newPassword })
      toast.success('Password updated. Please sign in.')
      navigate('/login')
    } catch (error) {
      toast.error(getApiError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-line p-8">
        <h1 className="text-3xl font-bold">Reset password</h1>
        {step === 1 ? (
          <form onSubmit={onEmail} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-lg border border-line px-3 py-2"
            />
            <button disabled={loading} className="w-full rounded-lg bg-brand py-3 font-semibold text-white">
              Send code
            </button>
          </form>
        ) : null}
        {step === 2 ? (
          <form onSubmit={onCode} className="mt-6 space-y-4">
            <input
              required
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="Reset code"
              className="w-full rounded-lg border border-line px-3 py-2"
            />
            <button disabled={loading} className="w-full rounded-lg bg-brand py-3 font-semibold text-white">
              Verify code
            </button>
          </form>
        ) : null}
        {step === 3 ? (
          <form onSubmit={onReset} className="mt-6 space-y-4">
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full rounded-lg border border-line px-3 py-2"
            />
            <button disabled={loading} className="w-full rounded-lg bg-brand py-3 font-semibold text-white">
              Update password
            </button>
          </form>
        ) : null}
        <Link to="/login" className="mt-4 inline-block text-sm text-brand">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
