import { describe, expect, it } from 'vitest'

import { createMockFetch } from './mock'

describe('createMockFetch', () => {
  it('accepts authorization from plain object headers', async () => {
    const response = await createMockFetch('/api/auth/access', {
      method: 'GET',
      headers: {
        authorization: 'Bearer admin-token',
      },
    })

    const payload = await response.json() as {
      code: number
      data: Array<{ routeKey: string }>
    }

    expect(payload.code).toBe(200)
    expect(payload.data.some(item => item.routeKey === '/dashboard')).toBe(true)
  })

  it('returns hidden and non-menu admin routes in access payload', async () => {
    const response = await createMockFetch('/api/auth/access', {
      method: 'GET',
      headers: {
        authorization: 'Bearer admin-token',
      },
    })

    const payload = await response.json() as {
      code: number
      data: Array<{ routeKey: string }>
    }

    expect(payload.code).toBe(200)
    expect(payload.data.some(item => item.routeKey === '/profile')).toBe(true)
    expect(payload.data.some(item => item.routeKey === '/examples/pages/advanced-search')).toBe(true)
    expect(payload.data.some(item => item.routeKey === '/examples/pages/batch-actions')).toBe(true)
    expect(payload.data.some(item => item.routeKey === '/examples/pages/inline-edit')).toBe(true)
    expect(payload.data.some(item => item.routeKey === '/examples/pages/tree-table')).toBe(true)
  })
})
