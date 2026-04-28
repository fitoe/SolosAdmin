const AUTH_EXPIRED_EVENT = 'solos-admin:auth-expired'

export function emitAuthExpired(redirectTo?: string) {
  window.dispatchEvent(
    new CustomEvent<string | undefined>(AUTH_EXPIRED_EVENT, {
      detail: redirectTo,
    }),
  )
}

export function onAuthExpired(listener: (redirectTo?: string) => void) {
  const handler = (event: Event) => {
    listener((event as CustomEvent<string | undefined>).detail)
  }

  window.addEventListener(AUTH_EXPIRED_EVENT, handler)

  return () => {
    window.removeEventListener(AUTH_EXPIRED_EVENT, handler)
  }
}
