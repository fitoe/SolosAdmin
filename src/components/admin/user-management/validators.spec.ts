import { describe, expect, it } from 'vitest'

import { isValidPhone, isValidResetPassword, normalizeUserPayload } from './validators'

describe('user management validators', () => {
  it('accepts mainland china phone numbers', () => {
    expect(isValidPhone('13800000000')).toBe(true)
    expect(isValidPhone('12800000000')).toBe(false)
  })

  it('requires strong-enough reset passwords', () => {
    expect(isValidResetPassword('1234567')).toBe(false)
    expect(isValidResetPassword('12345678')).toBe(true)
  })

  it('trims user form payload fields', () => {
    expect(
      normalizeUserPayload({
        name: '  Test User  ',
        email: '  test@solos.dev  ',
        phone: ' 13800000000 ',
        roleCodes: ['editor'],
        status: 'active',
        remark: '  note  ',
      }),
    ).toEqual({
      name: 'Test User',
      email: 'test@solos.dev',
      phone: '13800000000',
      roleCodes: ['editor'],
      status: 'active',
      remark: 'note',
    })
  })
})
