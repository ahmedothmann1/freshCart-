import { type FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { EmptyState } from '../components/common/EmptyState'
import { Spinner } from '../components/common/Spinner'
import { getApiError } from '../lib/http'
import { addressService } from '../services/address.service'
import type { Address } from '../types/api'

export function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', details: '', phone: '', city: '' })

  async function load() {
    setLoading(true)
    try {
      const { data } = await addressService.list()
      setAddresses(data.data || [])
    } catch (error) {
      toast.error(getApiError(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function onAdd(event: FormEvent) {
    event.preventDefault()
    try {
      const { data } = await addressService.add(form)
      setAddresses(data.data || [])
      setForm({ name: '', details: '', phone: '', city: '' })
      toast.success('Address saved')
      await load()
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  async function onRemove(id: string) {
    try {
      await addressService.remove(id)
      toast.success('Address removed')
      await load()
    } catch (error) {
      toast.error(getApiError(error))
    }
  }

  if (loading) return <Spinner label="Loading addresses..." />

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold">Addresses</h1>
      <form onSubmit={onAdd} className="mt-6 grid max-w-xl gap-3 rounded-2xl border border-line p-6">
        <input required placeholder="Label (Home, Work)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-line px-3 py-2" />
        <input required placeholder="Details" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="rounded-lg border border-line px-3 py-2" />
        <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg border border-line px-3 py-2" />
        <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-lg border border-line px-3 py-2" />
        <button className="rounded-lg bg-brand py-2 font-medium text-white">Add address</button>
      </form>
      {addresses.length === 0 ? (
        <EmptyState title="No addresses yet" message="Add a shipping address to speed up checkout." actionTo="/checkout" actionLabel="Go to checkout" />
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article key={address._id} className="rounded-2xl border border-line p-5">
              <h2 className="font-semibold">{address.name}</h2>
              <p className="text-sm text-muted">{address.details}</p>
              <p className="text-sm text-muted">{address.city}</p>
              <p className="text-sm text-muted">{address.phone}</p>
              <button type="button" onClick={() => void onRemove(address._id)} className="mt-3 text-sm text-red-500">
                Remove
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
