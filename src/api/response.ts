export interface ApiPayload<T> {
  code: number
  message: string
  data: T
}

export function resolveApiPayload<T>(payload: ApiPayload<T>) {
  if (payload.code === 401) {
    throw new Error('Unauthorized')
  }

  if (payload.code >= 400) {
    throw new Error(payload.message)
  }

  return payload.data
}
