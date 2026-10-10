import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from './Spinner'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner label="Checking session..." />
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
