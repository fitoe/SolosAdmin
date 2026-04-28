import { emitAuthExpired } from './session'
import {
  REFRESH_TOKEN_STORAGE_KEY,
  TOKEN_EXPIRES_AT_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
} from '@/constants/storage'

export interface StoredAuthSession {
  token: string
  refreshToken: string
  expiresAt: number
}

type RefreshRequester = (refreshToken: string) => Promise<StoredAuthSession>

let refreshRequester: RefreshRequester = async () => {
  throw new Error('No requester configured')
}

let refreshPromise: Promise<string | null> | null = null

export function setRefreshRequester(requester: RefreshRequester) {
  refreshRequester = requester
}

export function readStoredAuthSession(): StoredAuthSession {
  return {
    token: localStorage.getItem(TOKEN_STORAGE_KEY) ?? '',
    refreshToken: localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? '',
    expiresAt: Number(localStorage.getItem(TOKEN_EXPIRES_AT_STORAGE_KEY) ?? '0'),
  }
}

export function storeAuthSession(session: StoredAuthSession) {
  localStorage.setItem(TOKEN_STORAGE_KEY, session.token)
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, session.refreshToken)
  localStorage.setItem(TOKEN_EXPIRES_AT_STORAGE_KEY, String(session.expiresAt))
}

export function clearStoredAuthSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  localStorage.removeItem(TOKEN_EXPIRES_AT_STORAGE_KEY)
}

export function isTokenExpired(expiresAt: number, skewMs = 5_000) {
  return expiresAt > 0 && Date.now() + skewMs >= expiresAt
}

export async function ensureValidAccessToken() {
  const session = readStoredAuthSession()
  if (!session.token) {
    return null
  }

  if (!isTokenExpired(session.expiresAt)) {
    return session.token
  }

  if (!session.refreshToken) {
    clearStoredAuthSession()
    emitAuthExpired(window.location.pathname + window.location.search)
    throw new Error('Unauthorized')
  }

  if (!refreshPromise) {
    refreshPromise = refreshRequester(session.refreshToken)
      .then(nextSession => {
        storeAuthSession(nextSession)
        return nextSession.token
      })
      .catch(error => {
        clearStoredAuthSession()
        emitAuthExpired(window.location.pathname + window.location.search)
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}
