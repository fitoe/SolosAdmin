import type { BackendAccessEntry, LoginSession, UserProfile } from '@/types/app'

import { alova } from '@/api/client'

export function loginApi(role: UserProfile['role']) {
  return alova.Post<LoginSession>('/auth/login', { role })
}

export function profileApi() {
  return alova.Get<UserProfile>('/auth/profile')
}

export function accessPolicyApi() {
  return alova.Get<BackendAccessEntry[]>('/auth/access')
}

export function refreshApi(refreshToken: string) {
  return alova.Post<Omit<LoginSession, 'user'>>('/auth/refresh', { refreshToken })
}
