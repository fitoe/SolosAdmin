import type { RouteRecordRaw } from 'vue-router'

import { canAccessRoute, hasPermission } from '@/router/access'

export function usePermission() {
  const userStore = useUserStore()

  function canAccess(route: RouteRecordRaw) {
    return canAccessRoute(route, userStore.roles)
  }

  function can(permissionKeys?: string[]) {
    return hasPermission(userStore.permissions, permissionKeys)
  }

  return {
    canAccess,
    can,
  }
}
