import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    layout?: 'admin' | 'blank'
    requiresAuth?: boolean
    roles?: string[]
    permissions?: string[]
    hidden?: boolean
    keepAlive?: boolean
    affix?: boolean
    activeMenu?: string
    order?: number
  }
}

export {}
