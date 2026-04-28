import type { MenuRegistryItem, PageQueryResult, RolePolicy } from '@/types/app'

import { alova } from '@/api/client'

export interface UserListItem {
  id: string
  name: string
  email: string
  role: string
  status: string
  updatedAt: string
}

export function usersPageApi(params: { page: number; pageSize: number; keyword: string }) {
  return alova.Get<PageQueryResult<UserListItem>>('/system/users', {
    params,
  })
}

export function rolesRegistryApi() {
  return alova.Get<RolePolicy[]>('/system/roles')
}

export function menusRegistryApi() {
  return alova.Get<MenuRegistryItem[]>('/system/menus')
}
