export interface UserProfile {
  id: string
  name: string
  role: 'admin' | 'editor'
  roles: string[]
  permissions: string[]
  avatar: string
}

export interface BackendAccessEntry {
  routeKey: string
  title?: string
  hidden?: boolean
  order?: number
}

export interface RolePolicy {
  name: string
  code: string
  description: string
  members: number
  routeKeys: string[]
  permissionKeys: string[]
}

export interface MenuRegistryItem {
  routeKey: string
  title: string
  path: string
  level: number
  roles: string[]
  permissions: string[]
  enabled: boolean
  order: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface LoginSession {
  token: string
  refreshToken: string
  expiresAt: number
  user: UserProfile
}

export interface PageQueryResult<T> {
  list: T[]
  total: number
}

export type SystemUserStatus = 'active' | 'disabled'

export interface SystemUser {
  id: string
  name: string
  email: string
  phone: string
  roleCodes: string[]
  status: SystemUserStatus
  remark: string
  createdAt: string
  updatedAt: string
}

export type SystemUserListItem = SystemUser

export interface SystemUserPayload {
  name: string
  email: string
  phone: string
  roleCodes: string[]
  status: SystemUserStatus
  remark: string
}

export interface SystemUserQuery {
  page: number
  pageSize: number
  keyword: string
  status: SystemUserStatus | ''
  roleCode: string
}

export interface SystemUserStatusPayload {
  ids: string[]
  status: SystemUserStatus
}

export interface ResetUserPasswordPayload {
  id: string
  password: string
}
