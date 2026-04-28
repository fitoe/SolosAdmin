import { describe, expect, it } from 'vitest'

import { resolveNavigationGuard } from './guards'

describe('resolveNavigationGuard', () => {
  it('redirects unauthenticated users to login', async () => {
    const result = await resolveNavigationGuard({
      toPath: '/system/access/users',
      fullPath: '/system/access/users',
      requiresAuth: true,
      isLoggedIn: false,
      routeLayout: 'admin',
      routeKey: '/system/access/users',
      userRoles: [],
      routeRoles: ['admin'],
      canAccessRouteKey: () => false,
      ensureSessionReady: async () => undefined,
    })

    expect(result).toEqual({
      path: '/login',
      query: { redirect: '/system/access/users' },
    })
  })

  it('redirects to 403 when role is missing', async () => {
    const result = await resolveNavigationGuard({
      toPath: '/system/config/menus',
      fullPath: '/system/config/menus',
      requiresAuth: true,
      isLoggedIn: true,
      routeLayout: 'admin',
      routeKey: '/system/config/menus',
      userRoles: ['editor'],
      routeRoles: ['admin'],
      canAccessRouteKey: () => true,
      ensureSessionReady: async () => undefined,
    })

    expect(result).toBe('/403')
  })

  it('redirects to 403 when backend access map blocks route key', async () => {
    const result = await resolveNavigationGuard({
      toPath: '/examples/visual/charts',
      fullPath: '/examples/visual/charts',
      requiresAuth: true,
      isLoggedIn: true,
      routeLayout: 'admin',
      routeKey: '/examples/visual/charts',
      userRoles: ['admin'],
      routeRoles: undefined,
      canAccessRouteKey: () => false,
      ensureSessionReady: async () => undefined,
    })

    expect(result).toBe('/403')
  })
})
