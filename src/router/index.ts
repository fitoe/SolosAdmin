import type { RouteRecordRaw } from 'vue-router'

import { onAuthExpired } from '@/auth/session'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { resolveNavigationGuard } from './guards'

function normalizeRoutes(routeRecords: RouteRecordRaw[]) {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      meta: {
        hidden: true,
      },
    },
    ...routeRecords,
  ]
}

export const appRoutes = normalizeRoutes(routes)

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: appRoutes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export async function setupRouter() {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const tabsStore = useTabsStore()

  userStore.restore()
  if (userStore.isLoggedIn) {
    permissionStore.generate(appRoutes, userStore.roles)
  }
  tabsStore.restoreTabs()

  onAuthExpired(async redirectTo => {
    userStore.logout()
    if (router.currentRoute.value.path !== '/login') {
      await router.push({
        path: '/login',
        query: redirectTo ? { redirect: redirectTo } : undefined,
      })
    }
  })

  router.beforeEach(async to => {
    const requiresAuth = to.meta.requiresAuth !== false
    return resolveNavigationGuard({
      toPath: to.path,
      fullPath: to.fullPath,
      requiresAuth,
      isLoggedIn: userStore.isLoggedIn,
      routeLayout: String(to.meta.layout ?? 'admin'),
      routeKey: String(to.name ?? to.path),
      userRoles: userStore.roles,
      routeRoles: to.meta.roles,
      canAccessRouteKey: routeKey => permissionStore.canAccessRouteKey(routeKey),
      ensureSessionReady: async () => {
        if (!userStore.profile) {
          await userStore.fetchProfile()
        }

        if (!permissionStore.initialized) {
          await permissionStore.fetchAndGenerate(appRoutes, userStore.roles)
        }
      },
    })
  })

  router.afterEach(to => {
    if (to.meta.layout === 'blank' || to.meta.hidden) {
      return
    }

    tabsStore.openTab({
      fullPath: to.fullPath,
      path: to.path,
      name: String(to.name ?? to.path),
      title: to.meta.title ?? String(to.name ?? to.path),
      affix: Boolean(to.meta.affix),
      keepAlive: Boolean(to.meta.keepAlive),
    })
  })
}
