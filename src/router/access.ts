import type { RouteRecordRaw } from 'vue-router'
import type { BackendAccessEntry } from '@/types/app'

function matchesRoles(route: RouteRecordRaw, roles: string[]) {
  const expectedRoles = route.meta?.roles
  if (!expectedRoles || expectedRoles.length === 0) {
    return true
  }

  return expectedRoles.some(role => roles.includes(role))
}

export function hasPermission(ownedPermissions: string[], requiredPermissions?: string[]) {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }

  return requiredPermissions.some(permission => ownedPermissions.includes(permission))
}

export function canAccessRoute(route: RouteRecordRaw, roles: string[]) {
  return matchesRoles(route, roles)
}

export function getRouteKey(route: RouteRecordRaw) {
  return String(route.name ?? route.path)
}

export function filterRoutesByRoles(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  return routes
    .filter(route => matchesRoles(route, roles))
    .map(route => {
      const nextRoute: RouteRecordRaw = { ...route }
      if (route.children?.length) {
        nextRoute.children = filterRoutesByRoles(route.children, roles)
      }
      return nextRoute
    })
}

export function filterRoutesByAccess(routes: RouteRecordRaw[], allowedRouteKeys: Set<string>): RouteRecordRaw[] {
  return routes
    .map(route => {
      const nextRoute: RouteRecordRaw = { ...route }
      if (route.children?.length) {
        nextRoute.children = filterRoutesByAccess(route.children, allowedRouteKeys)
      }
      return nextRoute
    })
    .filter(route => allowedRouteKeys.has(getRouteKey(route)) || Boolean(route.children?.length))
}

export function applyAccessConfig(
  routes: RouteRecordRaw[],
  entriesByRouteKey: Record<string, Partial<BackendAccessEntry>>,
): RouteRecordRaw[] {
  return [...routes]
    .map(route => {
      const nextRoute: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, ...entriesByRouteKey[getRouteKey(route)] },
      }

      if (route.children?.length) {
        nextRoute.children = applyAccessConfig(route.children, entriesByRouteKey)
      }

      return nextRoute
    })
    .sort((left, right) => (left.meta?.order ?? Number.MAX_SAFE_INTEGER) - (right.meta?.order ?? Number.MAX_SAFE_INTEGER))
}
