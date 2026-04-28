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

  it('filters users by keyword, status and role code', async () => {
    const response = await createMockFetch('/api/system/users?page=1&pageSize=20&keyword=user%201&status=active&roleCode=editor', {
      method: 'GET',
      headers: {
        authorization: 'Bearer admin-token',
      },
    })

    const payload = await response.json() as {
      code: number
      data: {
        list: Array<{
          name: string
          status: string
          roleCodes: string[]
        }>
        total: number
      }
    }

    expect(payload.code).toBe(200)
    expect(payload.data.total).toBeGreaterThan(0)
    expect(payload.data.list.every(item => item.name.toLowerCase().includes('user 1'))).toBe(true)
    expect(payload.data.list.every(item => item.status === 'active')).toBe(true)
    expect(payload.data.list.every(item => item.roleCodes.includes('editor'))).toBe(true)
  })

  it('creates and updates a user', async () => {
    const createResponse = await createMockFetch('/api/system/users', {
      method: 'POST',
      headers: {
        authorization: 'Bearer admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'New User',
        email: 'new.user@solos.dev',
        phone: '13800000000',
        roleCodes: ['editor'],
        status: 'active',
        remark: 'Created in test',
      }),
    })

    const createdPayload = await createResponse.json() as {
      code: number
      data: {
        id: string
        name: string
        roleCodes: string[]
        status: string
      }
    }

    expect(createdPayload.code).toBe(200)
    expect(createdPayload.data.name).toBe('New User')
    expect(createdPayload.data.roleCodes).toEqual(['editor'])
    expect(createdPayload.data.status).toBe('active')

    const updateResponse = await createMockFetch(`/api/system/users/${createdPayload.data.id}`, {
      method: 'PATCH',
      headers: {
        authorization: 'Bearer admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Updated User',
        email: 'updated.user@solos.dev',
        phone: '13900000000',
        roleCodes: ['admin'],
        status: 'disabled',
        remark: 'Updated in test',
      }),
    })

    const updatedPayload = await updateResponse.json() as {
      code: number
      data: {
        name: string
        roleCodes: string[]
        status: string
      }
    }

    expect(updatedPayload.code).toBe(200)
    expect(updatedPayload.data.name).toBe('Updated User')
    expect(updatedPayload.data.roleCodes).toEqual(['admin'])
    expect(updatedPayload.data.status).toBe('disabled')
  })

  it('updates user status in batch', async () => {
    const listResponse = await createMockFetch('/api/system/users?page=1&pageSize=2', {
      method: 'GET',
      headers: {
        authorization: 'Bearer admin-token',
      },
    })
    const listPayload = await listResponse.json() as {
      code: number
      data: {
        list: Array<{ id: string }>
      }
    }

    const ids = listPayload.data.list.map(item => item.id)

    const response = await createMockFetch('/api/system/users/status', {
      method: 'PATCH',
      headers: {
        authorization: 'Bearer admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids,
        status: 'disabled',
      }),
    })

    const payload = await response.json() as {
      code: number
      data: {
        updatedCount: number
      }
    }

    expect(payload.code).toBe(200)
    expect(payload.data.updatedCount).toBe(ids.length)
  })

  it('resets password and rejects too-short passwords', async () => {
    const successResponse = await createMockFetch('/api/system/users/reset-password', {
      method: 'POST',
      headers: {
        authorization: 'Bearer admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '1',
        password: 'new-password-123',
      }),
    })

    const successPayload = await successResponse.json() as {
      code: number
      data: {
        success: boolean
      }
    }

    expect(successPayload.code).toBe(200)
    expect(successPayload.data.success).toBe(true)

    const failedResponse = await createMockFetch('/api/system/users/reset-password', {
      method: 'POST',
      headers: {
        authorization: 'Bearer admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '1',
        password: '123',
      }),
    })

    const failedPayload = await failedResponse.json() as {
      code: number
      message: string
    }

    expect(failedResponse.status).toBe(400)
    expect(failedPayload.code).toBe(400)
    expect(failedPayload.message).toBe('Password must be at least 8 characters')
  })
})
