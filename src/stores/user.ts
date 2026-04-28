import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { clearStoredAuthSession, readStoredAuthSession, storeAuthSession } from '@/auth/refresh'
import {
  REFRESH_TOKEN_STORAGE_KEY,
  TOKEN_EXPIRES_AT_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '@/constants/storage'
import { loginApi, profileApi } from '@/api/modules/auth'
import type { UserProfile } from '@/types/app'

export const useUserStore = defineStore('user', () => {
  const session = readStoredAuthSession()
  const token = ref(session.token)
  const refreshToken = ref(session.refreshToken)
  const tokenExpiresAt = ref(session.expiresAt)
  const profile = ref<UserProfile | null>(readStoredProfile())

  const isLoggedIn = computed(() => Boolean(token.value))
  const roles = computed(() => profile.value?.roles ?? [])
  const permissions = computed(() => profile.value?.permissions ?? [])

  async function login(role: UserProfile['role']) {
    const response = await loginApi(role).send()
    token.value = response.token
    refreshToken.value = response.refreshToken
    tokenExpiresAt.value = response.expiresAt
    profile.value = response.user
    persist()
  }

  async function fetchProfile() {
    if (!token.value) {
      return null
    }

    const response = await profileApi().send()
    profile.value = response
    persist()
    return profile.value
  }

  function restore() {
    const nextSession = readStoredAuthSession()
    token.value = nextSession.token
    refreshToken.value = nextSession.refreshToken
    tokenExpiresAt.value = nextSession.expiresAt
    profile.value = readStoredProfile()
  }

  function logout() {
    const permissionStore = usePermissionStore()
    const tabsStore = useTabsStore()
    token.value = ''
    refreshToken.value = ''
    tokenExpiresAt.value = 0
    profile.value = null
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    localStorage.removeItem(TOKEN_EXPIRES_AT_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    clearStoredAuthSession()
    permissionStore.clear()
    tabsStore.clear()
  }

  function persist() {
    storeAuthSession({
      token: token.value,
      refreshToken: refreshToken.value,
      expiresAt: tokenExpiresAt.value,
    })
    if (profile.value) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile.value))
    }
  }

  return {
    token,
    refreshToken,
    tokenExpiresAt,
    profile,
    isLoggedIn,
    roles,
    permissions,
    login,
    fetchProfile,
    restore,
    logout,
  }
})

function readStoredProfile() {
  const rawValue = localStorage.getItem(USER_STORAGE_KEY)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as UserProfile
  } catch {
    return null
  }
}
