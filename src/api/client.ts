import { createAlova } from 'alova'
import { useRequest } from 'alova/client'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'

import { ensureValidAccessToken, setRefreshRequester } from '@/auth/refresh'
import { emitAuthExpired } from '@/auth/session'
import { TOKEN_STORAGE_KEY } from '@/constants/storage'
import { resolveApiRuntime } from './mode'
import { createMockFetch } from './mock'
import { resolveApiPayload } from './response'

const apiRuntime = resolveApiRuntime({
  mode: import.meta.env.VITE_API_MODE ?? 'mock',
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
})

setRefreshRequester(async refreshToken => {
  const requestInput = apiRuntime.useMock ? '/api/auth/refresh' : `${apiRuntime.baseURL}/auth/refresh`
  const requestFetch = apiRuntime.useMock ? createMockFetch : fetch
  const response = await requestFetch(requestInput, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })

  const payload = (await response.json()) as {
    code: number
    message: string
    data: {
      token: string
      refreshToken: string
      expiresAt: number
    } | null
  }

  if (payload.code !== 200 || !payload.data) {
    throw new Error(payload.message)
  }

  return payload.data
})

export const alova = createAlova({
  baseURL: apiRuntime.baseURL,
  statesHook: VueHook,
  requestAdapter: adapterFetch({
    customFetch: apiRuntime.useMock ? createMockFetch : undefined,
  }),
  async beforeRequest(method) {
    const isAuthRoute = method.url.includes('/auth/login') || method.url.includes('/auth/refresh')
    const token = isAuthRoute ? localStorage.getItem(TOKEN_STORAGE_KEY) : await ensureValidAccessToken()
    method.config.headers = {
      ...(method.config.headers ?? {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    }
  },
  responded: {
    async onSuccess(response) {
      const payload = (await response.clone().json()) as {
        code: number
        message: string
        data: unknown
      }

      try {
        return resolveApiPayload(payload)
      }
      catch (error) {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        if (error instanceof Error && error.message === 'Unauthorized') {
          emitAuthExpired(window.location.pathname + window.location.search)
        }
        throw error
      }
    },
    onError(error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        emitAuthExpired(window.location.pathname + window.location.search)
      }
      throw error
    },
  },
})

export { useRequest }
