export interface NavigationGuardInput {
  toPath: string
  fullPath: string
  requiresAuth: boolean
  isLoggedIn: boolean
  routeLayout?: string
  routeKey: string
  userRoles: string[]
  routeRoles?: string[]
  canAccessRouteKey: (routeKey: string) => boolean
  ensureSessionReady: () => Promise<void>
}

export type NavigationGuardResult =
  | true
  | '/403'
  | '/dashboard'
  | {
    path: '/login'
    query: {
      redirect: string
    }
  }

export async function resolveNavigationGuard(input: NavigationGuardInput): Promise<NavigationGuardResult> {
  if (input.requiresAuth && !input.isLoggedIn) {
    return {
      path: '/login',
      query: {
        redirect: input.fullPath,
      },
    }
  }

  if (input.toPath === '/login' && input.isLoggedIn) {
    return '/dashboard'
  }

  if (input.isLoggedIn) {
    await input.ensureSessionReady()
  }

  if (input.requiresAuth && input.routeRoles?.length) {
    const hasRole = input.routeRoles.some(role => input.userRoles.includes(role))
    if (!hasRole) {
      return '/403'
    }
  }

  if (input.requiresAuth && input.routeLayout !== 'blank' && !input.canAccessRouteKey(input.routeKey)) {
    return '/403'
  }

  return true
}
