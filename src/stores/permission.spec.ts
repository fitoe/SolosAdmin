import type { RouteRecordRaw } from 'vue-router'

import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { usePermissionStore } from './permission'

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: '/dashboard',
    component: {} as never,
    meta: {
      title: '工作台',
      layout: 'admin',
    },
  },
]

describe('permission store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('normalizes cached access titles to current route meta titles', () => {
    const permissionStore = usePermissionStore()

    permissionStore.generate(routes, ['admin'], [
      {
        routeKey: '/dashboard',
        title: 'Dashboard',
        order: 10,
      },
    ])

    expect(permissionStore.menuTree[0]?.title).toBe('工作台')
    expect(permissionStore.accessEntries[0]?.title).toBe('工作台')
  })
})
