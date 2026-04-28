export interface ApiRuntimeConfig {
  mode: string
  baseUrl: string
}

export function resolveApiRuntime(config: ApiRuntimeConfig) {
  const wantsRealBackend = config.mode === 'real' && config.baseUrl.length > 0

  return {
    useMock: !wantsRealBackend,
    baseURL: wantsRealBackend ? config.baseUrl : '/api',
  }
}
