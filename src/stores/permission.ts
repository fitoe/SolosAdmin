import type { RouteRecordRaw } from 'vue-router'
import type { BackendAccessEntry } from '@/types/app'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { accessPolicyApi } from '@/api/modules/auth'
import { ACCESS_STORAGE_KEY } from '@/constants/storage'
import { getRouteKey } from '@/router/access'
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
    const normalizedEntries = normalizeAccessEntries(nextEntries, routes)
    const roleFilteredRoutes = filterRoutesByRoles(routes, roles).filter(
      route => route.meta?.layout !== 'blank',
    )
    const accessFilteredRoutes =
      normalizedEntries.length > 0 ? filterRoutesByAccess(roleFilteredRoutes, new Set(normalizedEntries.map(item => item.routeKey))) : roleFilteredRoutes
    const configuredRoutes =
      normalizedEntries.length > 0
        ? applyAccessConfig(
            accessFilteredRoutes,
            Object.fromEntries(normalizedEntries.map(item => [item.routeKey, item])),
          )
        : accessFilteredRoutes

    accessEntries.value = normalizedEntries
    initialized.value = normalizedEntries.length > 0
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

function normalizeAccessEntries(entries: BackendAccessEntry[], routes: RouteRecordRaw[]) {
  const routeMetaByKey = collectRouteMetaByKey(routes)

  return entries.map((entry) => {
    const routeMeta = routeMetaByKey.get(entry.routeKey)

    return {
      ...entry,
      title: routeMeta?.title ?? entry.title,
    }
  })
}

function collectRouteMetaByKey(routes: RouteRecordRaw[]) {
  const routeMetaByKey = new Map<string, RouteRecordRaw['meta']>()

  for (const route of routes) {
    routeMetaByKey.set(getRouteKey(route), route.meta)

    if (route.children?.length) {
      for (const [key, meta] of collectRouteMetaByKey(route.children)) {
        routeMetaByKey.set(key, meta)
      }
    }
  }

  return routeMetaByKey
}
