import { type FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getApiError } from '../lib/http'
import { setToken } from '../lib/storage'
import { authService } from '../services/auth.service'

export function AccountPage() {
  const { user, refreshUser } = useAuth()
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  })
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    password: '',
    rePassword: '',
  })

  async function saveProfile(event: FormEvent) {
    event.preventDefault()
    try {
      const { data } = await authService.updateMe(profile)
      if (data.user) refreshUser(data.user)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault()
    if (passwords.password !== passwords.rePassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      const { data } = await authService.changePassword(passwords)
      if (data.token) setToken(data.token)
      toast.success('Password updated')
      setPasswords({ currentPassword: '', password: '', rePassword: '' })
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  return (
    <div className="container-page space-y-8 py-10">
      <h1 className="text-3xl font-bold">My account</h1>
      <p className="text-muted">Signed in as {user?.name} ({user?.role || 'user'})</p>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link to="/addresses" className="rounded-lg border border-line px-4 py-2">
          Addresses
        </Link>
        <Link to="/allorders" className="rounded-lg border border-line px-4 py-2">
          Orders
        </Link>
        <Link to="/wishlist" className="rounded-lg border border-line px-4 py-2">
          Wishlist
        </Link>
      </div>
      <form onSubmit={saveProfile} className="max-w-lg space-y-3 rounded-2xl border border-line p-6">
        <h2 className="font-semibold">Profile</h2>
        <input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2" />
        <input required type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2" />
        <input required value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" className="w-full rounded-lg border border-line px-3 py-2" />
        <button className="rounded-lg bg-brand px-4 py-2 font-medium text-white">Save profile</button>
      </form>
      <form onSubmit={savePassword} className="max-w-lg space-y-3 rounded-2xl border border-line p-6">
        <h2 className="font-semibold">Change password</h2>
        <input required type="password" placeholder="Current password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2" />
        <input required type="password" placeholder="New password" value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2" />
        <input required type="password" placeholder="Confirm password" value={passwords.rePassword} onChange={(e) => setPasswords({ ...passwords, rePassword: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2" />
        <button className="rounded-lg bg-brand px-4 py-2 font-medium text-white">Update password</button>
      </form>
      <div className="max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm">
        <h2 className="font-semibold">Product management</h2>
        <p className="mt-2 text-muted">
          The supplied Route API catalog has no customer or admin endpoint to create products (`POST /api/v1/products`
          is not documented). Product creation cannot be implemented without inventing a backend.
        </p>
      </div>
    </div>
  )
}
