import { api } from '../lib/http'
import type { AuthUser } from '../types/api'

export const authService = {
  signup(body: {
    name: string
    email: string
    password: string
    rePassword: string
    phone: string
  }) {
    return api.post<{ message: string; token: string; user: AuthUser }>('/api/v1/auth/signup', body)
  },
  signin(body: { email: string; password: string }) {
    return api.post<{ message: string; token: string; user: AuthUser }>('/api/v1/auth/signin', body)
  },
  forgotPassword(email: string) {
    return api.post<{ message: string; statusMsg?: string }>('/api/v1/auth/forgotPasswords', { email })
  },
  verifyResetCode(resetCode: string) {
    return api.post<{ status: string }>('/api/v1/auth/verifyResetCode', { resetCode })
  },
  resetPassword(body: { email: string; newPassword: string }) {
    return api.put<{ token?: string; message?: string }>('/api/v1/auth/resetPassword', body)
  },
  verifyToken() {
    return api.get('/api/v1/auth/verifyToken')
  },
  changePassword(body: { currentPassword: string; password: string; rePassword: string }) {
    return api.put<{ token?: string; message?: string }>('/api/v1/users/changeMyPassword', body)
  },
  updateMe(body: { name: string; email: string; phone: string }) {
    return api.put<{ user?: AuthUser; message?: string }>('/api/v1/users/updateMe/', body)
  },
}
