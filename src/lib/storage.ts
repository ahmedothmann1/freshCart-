const TOKEN_KEY = 'freshcart_token'
const USER_KEY = 'freshcart_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as { name: string; email: string; role?: string }
  } catch {
    return null
  }
}

export function setStoredUser(user: { name: string; email: string; role?: string }) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function decodeUserId(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as { id?: string }
    return payload.id ?? null
  } catch {
    return null
  }
}
