import { afterEach, describe, expect, it, vi } from 'vitest'

import { emitAuthExpired, onAuthExpired } from './session'

describe('auth session events', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('notifies listeners with redirect target when auth expires', () => {
    const listener = vi.fn()
    const stop = onAuthExpired(listener)

    emitAuthExpired('/system/access/users')

    expect(listener).toHaveBeenCalledWith('/system/access/users')
    stop()
  })

  it('supports removing listener', () => {
    const listener = vi.fn()
    const stop = onAuthExpired(listener)

    stop()
    emitAuthExpired('/dashboard')

    expect(listener).not.toHaveBeenCalled()
  })
})
