import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  clearStoredAuthSession,
  ensureValidAccessToken,
  readStoredAuthSession,
  setRefreshRequester,
  storeAuthSession,
} from './refresh'

describe('refresh auth session', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    setRefreshRequester(async () => {
      throw new Error('No requester configured')
    })
  })

  it('refreshes expired access token and stores new session', async () => {
    storeAuthSession({
      token: 'expired-token',
      refreshToken: 'refresh-token',
      expiresAt: Date.now() - 1_000,
    })

    setRefreshRequester(async refreshToken => {
      expect(refreshToken).toBe('refresh-token')
      return {
        token: 'new-token',
        refreshToken: 'new-refresh-token',
        expiresAt: Date.now() + 60_000,
      }
    })

    const nextToken = await ensureValidAccessToken()

    expect(nextToken).toBe('new-token')
    expect(readStoredAuthSession()).toMatchObject({
      token: 'new-token',
      refreshToken: 'new-refresh-token',
    })
  })

  it('clears session when refresh fails', async () => {
    storeAuthSession({
      token: 'expired-token',
      refreshToken: 'bad-refresh-token',
      expiresAt: Date.now() - 1_000,
    })

    setRefreshRequester(async () => {
      throw new Error('Unauthorized')
    })

    await expect(ensureValidAccessToken()).rejects.toThrow('Unauthorized')
    expect(readStoredAuthSession()).toEqual({
      token: '',
      refreshToken: '',
      expiresAt: 0,
    })
  })

  it('clears session explicitly', () => {
    storeAuthSession({
      token: 'token',
      refreshToken: 'refresh',
      expiresAt: Date.now() + 10_000,
    })

    clearStoredAuthSession()

    expect(readStoredAuthSession()).toEqual({
      token: '',
      refreshToken: '',
      expiresAt: 0,
    })
  })
})
