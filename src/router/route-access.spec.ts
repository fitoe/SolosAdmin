import type { RouteRecordRaw } from 'vue-router'
import { describe, expect, it } from 'vitest'

import { applyAccessConfig, canAccessRoute, filterRoutesByAccess, filterRoutesByRoles, hasPermission } from './access'
import { collectKeepAliveNames, deriveMenuTree } from './menu'

const routeTree: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: {} as never,
    meta: { title: 'Root', icon: 'i-ep-house', requiresAuth: true, affix: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: {} as never,
        meta: { title: 'Dashboard', icon: 'i-ep-data-analysis', roles: ['admin', 'editor'] },
      },
      {
        path: 'system',
        name: 'system',
        component: {} as never,
        meta: { title: 'System', icon: 'i-ep-setting', roles: ['admin'] },
        children: [
          {
            path: 'users',
            name: 'users',
            component: {} as never,
            meta: { title: 'Users', permissions: ['system:user:view'] },
          },
          {
            path: 'hidden',
            name: 'hidden-page',
            component: {} as never,
            meta: { title: 'Hidden', hidden: true },
          },
          {
            path: 'nested',
            name: 'nested-root',
            component: {} as never,
            meta: { title: 'Nested Root' },
            children: [
              {
                path: 'deep',
                name: 'deep-page',
                component: {} as never,
                meta: { title: 'Deep Page', keepAlive: true },
              },
            ],
          },
        ],
      },
    ],
  },
]

describe('route access', () => {
  it('filters routes by roles recursively', () => {
    const filtered = filterRoutesByRoles(routeTree, ['editor'])

    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.children).toHaveLength(1)
    expect(filtered[0]?.children?.[0]?.name).toBe('dashboard')
  })

  it('checks route roles and button permissions', () => {
    const adminRoute = routeTree[0]?.children?.[1]

    expect(canAccessRoute(adminRoute!, ['admin'])).toBe(true)
    expect(canAccessRoute(adminRoute!, ['editor'])).toBe(false)
    expect(hasPermission(['system:user:view', 'system:role:view'], ['system:user:view'])).toBe(true)
    expect(hasPermission(['system:role:view'], ['system:user:view'])).toBe(false)
  })

  it('filters routes by backend route keys and keeps required parents', () => {
    const filtered = filterRoutesByAccess(routeTree, new Set(['dashboard', 'nested-root', 'deep-page']))

    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.children?.map(item => item.name)).toEqual(['dashboard', 'system'])
    expect(filtered[0]?.children?.[1]?.children?.map(item => item.name)).toEqual(['nested-root'])
  })

  it('applies backend route config overrides and ordering', () => {
    const configured = applyAccessConfig(routeTree, {
      dashboard: { order: 20 },
      system: { order: 10 },
      users: { title: 'Members', order: 2 },
      'nested-root': { order: 1 },
    })

    expect(configured[0]?.children?.map(item => item.name)).toEqual(['system', 'dashboard'])
    expect(configured[0]?.children?.[0]?.children?.[1]?.meta?.title).toBe('Members')
    expect(configured[0]?.children?.[0]?.children?.[0]?.name).toBe('nested-root')
  })
})

describe('route menu derivation', () => {
  it('builds infinite depth menu tree and removes hidden pages', () => {
    const menus = deriveMenuTree(routeTree)

    expect(menus).toHaveLength(1)
    expect(menus[0]?.children).toHaveLength(2)
    expect(menus[0]?.children?.[1]?.children).toHaveLength(2)
    expect(menus[0]?.children?.[1]?.children?.[1]?.children?.[0]?.name).toBe('deep-page')
  })

  it('collects keep-alive component names from route meta', () => {
    expect(collectKeepAliveNames(routeTree)).toEqual(['deep-page'])
  })
})
