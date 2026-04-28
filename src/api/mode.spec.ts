import { describe, expect, it } from 'vitest'

import { resolveApiRuntime } from './mode'

describe('resolveApiRuntime', () => {
  it('uses mock runtime when mode is mock', () => {
    const runtime = resolveApiRuntime({
      mode: 'mock',
      baseUrl: 'https://api.example.com',
    })

    expect(runtime.baseURL).toBe('/api')
    expect(runtime.useMock).toBe(true)
  })

  it('uses real runtime when mode is real and base url exists', () => {
    const runtime = resolveApiRuntime({
      mode: 'real',
      baseUrl: 'https://api.example.com',
    })

    expect(runtime.baseURL).toBe('https://api.example.com')
    expect(runtime.useMock).toBe(false)
  })

  it('falls back to mock when real mode misses base url', () => {
    const runtime = resolveApiRuntime({
      mode: 'real',
      baseUrl: '',
    })

    expect(runtime.baseURL).toBe('/api')
    expect(runtime.useMock).toBe(true)
  })
})
