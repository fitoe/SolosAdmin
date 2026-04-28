import type { SystemUserPayload } from '@/types/app'

const chinaMainlandPhonePattern = /^1[3-9]\d{9}$/

export function isValidPhone(phone: string) {
  return chinaMainlandPhonePattern.test(phone.trim())
}

export function isValidResetPassword(password: string) {
  return password.trim().length >= 8
}

export function normalizeUserPayload(payload: SystemUserPayload): SystemUserPayload {
  return {
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    roleCodes: [...payload.roleCodes],
    status: payload.status,
    remark: payload.remark.trim(),
  }
}
