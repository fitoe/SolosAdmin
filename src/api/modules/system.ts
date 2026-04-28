import type {
  MenuRegistryItem,
  PageQueryResult,
  ResetUserPasswordPayload,
  RolePolicy,
  SystemUserListItem,
  SystemUserPayload,
  SystemUserQuery,
  SystemUserStatusPayload,
} from '@/types/app'

import { alova } from '@/api/client'

export function usersPageApi(params: SystemUserQuery) {
  return alova.Get<PageQueryResult<SystemUserListItem>>('/system/users', {
    params,
  })
}

export function createUserApi(payload: SystemUserPayload) {
  return alova.Post<SystemUserListItem>('/system/users', payload)
}

export function updateUserApi(id: string, payload: SystemUserPayload) {
  return alova.Patch<SystemUserListItem>(`/system/users/${id}`, payload)
}

export function updateUserStatusApi(id: string, status: SystemUserStatusPayload['status']) {
  return alova.Patch<SystemUserListItem>(`/system/users/${id}/status`, { status })
}

export function batchUpdateUserStatusApi(payload: SystemUserStatusPayload) {
  return alova.Patch<{ updatedCount: number }>('/system/users/status', payload)
}

export function resetUserPasswordApi(payload: ResetUserPasswordPayload) {
  return alova.Post<{ success: boolean }>('/system/users/reset-password', payload)
}

export function rolesRegistryApi() {
  return alova.Get<RolePolicy[]>('/system/roles')
}

export function menusRegistryApi() {
  return alova.Get<MenuRegistryItem[]>('/system/menus')
}
