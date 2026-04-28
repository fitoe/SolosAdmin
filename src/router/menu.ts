import type { RouteRecordRaw } from 'vue-router'

export interface MenuItem {
  path: string
  name: string
  title: string
  icon?: string
  children?: MenuItem[]
}

function joinRoutePath(parentPath: string, path: string) {
  if (!path) {
    return parentPath || '/'
  }

  if (path.startsWith('/')) {
    return path
  }

  const base = parentPath === '/' ? '' : parentPath
  return `${base}/${path}`.replace(/\/+/g, '/')
}

function normalizeMenuRoute(route: RouteRecordRaw, parentPath = '/'): MenuItem | null {
  if (route.meta?.hidden) {
    return null
  }

  const path = joinRoutePath(parentPath, route.path)
  const children = [...(route.children ?? [])]
    .sort((left, right) => (left.meta?.order ?? Number.MAX_SAFE_INTEGER) - (right.meta?.order ?? Number.MAX_SAFE_INTEGER))
    .map(child => normalizeMenuRoute(child, path))
    .filter((item): item is MenuItem => item !== null)

  if (!route.meta?.title && children.length === 0) {
    return null
  }

  return {
    path,
    name: String(route.name ?? path),
    title: route.meta?.title ?? String(route.name ?? path),
    icon: route.meta?.icon,
    children: children.length > 0 ? children : undefined,
  }
}

function collectKeepAliveFromRoute(route: RouteRecordRaw, names: string[]) {
  if (route.meta?.keepAlive && route.name) {
    names.push(String(route.name))
  }

  for (const child of route.children ?? []) {
    collectKeepAliveFromRoute(child, names)
  }
}

export function deriveMenuTree(routes: RouteRecordRaw[]) {
  return routes
    .map(route => normalizeMenuRoute(route))
    .filter((item): item is MenuItem => item !== null)
}

export function collectKeepAliveNames(routes: RouteRecordRaw[]) {
  const names: string[] = []

  for (const route of routes) {
    collectKeepAliveFromRoute(route, names)
  }

  return names
}
