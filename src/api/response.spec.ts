import { describe, expect, it } from 'vitest'

import { resolveApiPayload } from './response'

describe('resolveApiPayload', () => {
  it('returns data when payload is successful', () => {
    expect(
      resolveApiPayload({
        code: 200,
        message: 'ok',
        data: { value: 1 },
      }),
    ).toEqual({ value: 1 })
  })

  it('throws Unauthorized on 401 payload', () => {
    expect(() =>
      resolveApiPayload({
        code: 401,
        message: 'Unauthorized',
        data: null,
      }),
    ).toThrow('Unauthorized')
  })

  it('throws message on business error payload', () => {
    expect(() =>
      resolveApiPayload({
        code: 500,
        message: 'Server exploded',
        data: null,
      }),
    ).toThrow('Server exploded')
  })
})
