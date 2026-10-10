import axios, { AxiosError } from 'axios'
import { clearSession, getToken } from './storage'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ecommerce.routemisr.com',
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.token = token
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: { msg?: string }[] }>) => {
    if (error.response?.status === 401) {
      clearSession()
    }
    return Promise.reject(error)
  },
)

export function getApiError(error: unknown, fallback = 'Something went wrong') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: { msg?: string }[]; statusMsg?: string }
      | undefined
    return data?.errors?.[0]?.msg || data?.message || error.message || fallback
  }
  return fallback
}
