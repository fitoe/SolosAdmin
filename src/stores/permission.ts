import type { RouteRecordRaw } from 'vue-router'
import type { BackendAccessEntry } from '@/types/app'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { accessPolicyApi } from '@/api/modules/auth'
import { ACCESS_STORAGE_KEY } from '@/constants/storage'
import { applyAccessConfig, filterRoutesByAccess, filterRoutesByRoles } from '@/router/access'
import { deriveMenuTree, type MenuItem } from '@/router/menu'

export const usePermissionStore = defineStore('permission', () => {
  const accessibleRoutes = ref<RouteRecordRaw[]>([])
  const menuTree = ref<MenuItem[]>([])
  const accessEntries = ref<BackendAccessEntry[]>(readStoredAccessEntries())
  const initialized = ref(accessEntries.value.length > 0)

  const flatMenuItems = computed(() => flattenMenus(menuTree.value))
  const allowedRouteKeys = computed(() => new Set(accessEntries.value.map(item => item.routeKey)))

  function generate(routes: RouteRecordRaw[], roles: string[], nextEntries: BackendAccessEntry[] = accessEntries.value) {
    const roleFilteredRoutes = filterRoutesByRoles(routes, roles).filter(
      route => route.meta?.layout !== 'blank',
    )
    const accessFilteredRoutes =
      nextEntries.length > 0 ? filterRoutesByAccess(roleFilteredRoutes, new Set(nextEntries.map(item => item.routeKey))) : roleFilteredRoutes
    const configuredRoutes =
      nextEntries.length > 0
        ? applyAccessConfig(
            accessFilteredRoutes,
            Object.fromEntries(nextEntries.map(item => [item.routeKey, item])),
          )
        : accessFilteredRoutes

    accessEntries.value = nextEntries
    initialized.value = nextEntries.length > 0
    accessibleRoutes.value = configuredRoutes
    menuTree.value = deriveMenuTree(configuredRoutes)
    persist()
  }

  async function fetchAndGenerate(routes: RouteRecordRaw[], roles: string[]) {
    const nextEntries = await accessPolicyApi().send()
    generate(routes, roles, nextEntries)
  }

  function canAccessRouteKey(routeKey: string) {
    return allowedRouteKeys.value.size === 0 || allowedRouteKeys.value.has(routeKey)
  }

  function clear() {
    accessEntries.value = []
    accessibleRoutes.value = []
    menuTree.value = []
    initialized.value = false
    localStorage.removeItem(ACCESS_STORAGE_KEY)
  }

  function persist() {
    localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(accessEntries.value))
  }

  return {
    accessibleRoutes,
    menuTree,
    flatMenuItems,
    accessEntries,
    initialized,
    generate,
    fetchAndGenerate,
    canAccessRouteKey,
    clear,
  }
})

function flattenMenus(items: MenuItem[]): MenuItem[] {
  return items.flatMap((item): MenuItem[] => [item, ...(item.children ? flattenMenus(item.children) : [])])
}

function readStoredAccessEntries() {
  const rawValue = localStorage.getItem(ACCESS_STORAGE_KEY)
  if (!rawValue) {
    return [] as BackendAccessEntry[]
  }

  try {
    return JSON.parse(rawValue) as BackendAccessEntry[]
  } catch {
    return []
  }
}
