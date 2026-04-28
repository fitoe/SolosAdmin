import type {
  BackendAccessEntry,
  MenuRegistryItem,
  ResetUserPasswordPayload,
  RolePolicy,
  SystemUser,
  SystemUserPayload,
  SystemUserStatus,
  SystemUserStatusPayload,
  UserProfile,
} from '@/types/app'

const roleDictionary = {
  admin: {
    name: '管理员',
    description: '拥有完整后台权限和用户管理能力。',
    permissionKeys: [
      'system:user:view',
      'system:user:create',
      'system:user:edit',
      'system:user:status',
      'system:user:reset-password',
      'system:role:view',
      'system:menu:view',
    ],
  },
  editor: {
    name: '编辑员',
    description: '仅可访问内容与基础展示页面，不可进入用户管理。',
    permissionKeys: [],
  },
} as const

const adminRouteKeys = [
  '/dashboard',
  '/system',
  '/system/access',
  '/system/access/users',
  '/system/access/roles',
  '/system/config',
  '/system/config/menus',
  '/system/config/dicts',
  '/system/config/logs',
  '/examples',
  '/examples/pages',
  '/examples/pages/advanced-search',
  '/examples/pages/batch-actions',
  '/examples/pages/list',
  '/examples/pages/form',
  '/examples/pages/detail',
  '/examples/pages/inline-edit',
  '/examples/pages/tree-table',
  '/examples/visual',
  '/examples/visual/charts',
  '/examples/content',
  '/examples/content/markdown',
  '/examples/content/uploads',
  '/examples/content/excel',
  '/profile',
]

const editorRouteKeys = [
  '/dashboard',
  '/examples',
  '/examples/pages',
  '/examples/pages/list',
  '/examples/pages/detail',
  '/examples/content',
  '/examples/content/markdown',
  '/profile',
]

const adminUser: UserProfile = {
  id: '1',
  name: '管理员',
  role: 'admin',
  roles: ['admin'],
  permissions: [...roleDictionary.admin.permissionKeys],
  avatar: 'AU',
}

const editorUser: UserProfile = {
  id: '2',
  name: '编辑员',
  role: 'editor',
  roles: ['editor'],
  permissions: [...roleDictionary.editor.permissionKeys],
  avatar: 'EU',
}

const menuRegistry: MenuRegistryItem[] = [
  { routeKey: '/dashboard', title: '工作台', path: '/dashboard', level: 1, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/system', title: '系统管理', path: '/system', level: 1, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/system/access', title: '权限管理', path: '/system/access', level: 2, roles: ['admin'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/system/access/users', title: '用户管理', path: '/system/access/users', level: 3, roles: ['admin'], permissions: ['system:user:view'], enabled: true, order: 10 },
  { routeKey: '/system/access/roles', title: '角色管理', path: '/system/access/roles', level: 3, roles: ['admin'], permissions: ['system:role:view'], enabled: true, order: 20 },
  { routeKey: '/system/config', title: '系统配置', path: '/system/config', level: 2, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/system/config/menus', title: '菜单配置', path: '/system/config/menus', level: 3, roles: ['admin'], permissions: ['system:menu:view'], enabled: true, order: 10 },
  { routeKey: '/system/config/dicts', title: '字典配置', path: '/system/config/dicts', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/system/config/logs', title: '操作日志', path: '/system/config/logs', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 30 },
  { routeKey: '/examples', title: '示例中心', path: '/examples', level: 1, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 30 },
  { routeKey: '/examples/pages', title: '页面模板', path: '/examples/pages', level: 2, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/examples/pages/list', title: '列表模板', path: '/examples/pages/list', level: 3, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/examples/pages/form', title: '表单模板', path: '/examples/pages/form', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/examples/pages/detail', title: '详情模板', path: '/examples/pages/detail', level: 3, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 30 },
  { routeKey: '/examples/visual', title: '可视化', path: '/examples/visual', level: 2, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/examples/visual/charts', title: '图表示例', path: '/examples/visual/charts', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/examples/content', title: '内容管理', path: '/examples/content', level: 2, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 30 },
  { routeKey: '/examples/content/markdown', title: 'Markdown 编辑器', path: '/examples/content/markdown', level: 3, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/examples/content/uploads', title: '上传示例', path: '/examples/content/uploads', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/examples/content/excel', title: 'Excel 导入导出', path: '/examples/content/excel', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 30 },
]

const userPasswords = new Map<string, string>()

const users: SystemUser[] = Array.from({ length: 28 }, (_, index) => {
  const isAdmin = index % 6 === 0
  const roleCodes = isAdmin ? ['admin'] : ['editor']
  const status: SystemUserStatus = index % 4 === 0 ? 'disabled' : 'active'
  const day = String((index % 9) + 10).padStart(2, '0')
  const minute = String(index % 6).padStart(2, '0')
  const user: SystemUser = {
    id: String(index + 1),
    name: `User ${index + 1}`,
    email: `user${index + 1}@solos.dev`,
    phone: `1380000${String(index + 1).padStart(4, '0')}`,
    roleCodes,
    status,
    remark: isAdmin ? 'Seed admin account' : 'Seed editor account',
    createdAt: `2026-04-${day} 09:${minute}`,
    updatedAt: `2026-04-${day} 18:${minute}`,
  }

  userPasswords.set(user.id, 'initial-password-123')
  return user
})

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

function readAuthorizationHeader(headers?: HeadersInit) {
  if (!headers) {
    return null
  }

  if (headers instanceof Headers) {
    return headers.get('authorization')
  }

  if (Array.isArray(headers)) {
    const entry = headers.find(([key]) => key.toLowerCase() === 'authorization')
    return entry?.[1] ?? null
  }

  const record = headers as Record<string, string>
  return record.authorization ?? record.Authorization ?? null
}

function parseJsonBody<T>(body?: BodyInit | null): T {
  if (typeof body !== 'string') {
    return {} as T
  }

  return JSON.parse(body) as T
}

function timestampLabel(offset: number) {
  const day = String((offset % 9) + 10).padStart(2, '0')
  const minute = String(offset % 6).padStart(2, '0')
  return `2026-04-${day} 19:${minute}`
}

function normalizeUserPayload(payload: SystemUserPayload): SystemUserPayload {
  return {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    roleCodes: [...payload.roleCodes],
    status: payload.status,
    remark: payload.remark.trim(),
  }
}

function getRolePolicyDefinitions(): Array<Pick<RolePolicy, 'code' | 'routeKeys' | 'permissionKeys'> & { name: string; description: string }> {
  return [
    {
      code: 'admin',
      name: roleDictionary.admin.name,
      description: roleDictionary.admin.description,
      routeKeys: adminRouteKeys,
      permissionKeys: [...roleDictionary.admin.permissionKeys],
    },
    {
      code: 'editor',
      name: roleDictionary.editor.name,
      description: roleDictionary.editor.description,
      routeKeys: editorRouteKeys,
      permissionKeys: [...roleDictionary.editor.permissionKeys],
    },
  ]
}

function buildRolePolicies(): RolePolicy[] {
  return getRolePolicyDefinitions().map(role => ({
    name: role.name,
    code: role.code,
    description: role.description,
    members: users.filter(user => user.roleCodes.includes(role.code)).length,
    routeKeys: role.routeKeys,
    permissionKeys: role.permissionKeys,
  }))
}

function buildAccessEntries(routeKeys: string[]) {
  const menuEntryByRouteKey = new Map(menuRegistry.map(item => [item.routeKey, item]))

  return routeKeys.map((routeKey, index) => {
    const menuEntry = menuEntryByRouteKey.get(routeKey)

    return {
      routeKey,
      title: menuEntry?.title ?? routeKey,
      order: menuEntry?.order ?? 1000 + index,
    }
  })
}

function accessEntriesByRole(role: UserProfile['role']): BackendAccessEntry[] {
  return buildAccessEntries(role === 'admin' ? adminRouteKeys : editorRouteKeys)
}

function findUserIndex(id: string) {
  return users.findIndex(user => user.id === id)
}

function getUserOrResponse(id: string): SystemUser | Response {
  const user = users.find(item => item.id === id)
  return user ?? jsonResponse({ code: 404, message: 'User not found', data: null }, 404)
}

function isValidStatus(value: string): value is SystemUserStatus {
  return value === 'active' || value === 'disabled'
}

function validateUserPayload(payload: SystemUserPayload) {
  const normalized = normalizeUserPayload(payload)

  if (!normalized.name) {
    return 'Name is required'
  }
  if (!normalized.email) {
    return 'Email is required'
  }
  if (!normalized.phone) {
    return 'Phone is required'
  }
  if (normalized.roleCodes.length === 0) {
    return 'At least one role is required'
  }
  if (!isValidStatus(normalized.status)) {
    return 'Status is invalid'
  }

  return null
}

export async function createMockFetch(input: RequestInfo | URL, init?: RequestInit) {
  const rawUrl = String(input)
  const url = new URL(rawUrl.startsWith('http') ? rawUrl : `https://mock.local${rawUrl}`)
  const pathname = url.pathname
  const method = (init?.method ?? 'GET').toUpperCase()
  const token = readAuthorizationHeader(init?.headers)

  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = parseJsonBody<{ role?: UserProfile['role'] }>(init?.body)
    const user = body.role === 'editor' ? editorUser : adminUser
    const now = Date.now()
    return jsonResponse({
      code: 200,
      message: 'ok',
      data: {
        token: `${user.role}-token`,
        refreshToken: `${user.role}-refresh-token`,
        expiresAt: now + 15 * 60 * 1000,
        user,
      },
    })
  }

  if (pathname === '/api/auth/refresh' && method === 'POST') {
    const body = parseJsonBody<{ refreshToken?: string }>(init?.body)
    const refreshToken = String(body.refreshToken ?? '')
    const role = refreshToken.includes('editor') ? 'editor' : refreshToken.includes('admin') ? 'admin' : ''

    if (!role) {
      return jsonResponse({ code: 401, message: 'Unauthorized', data: null }, 401)
    }

    return jsonResponse({
      code: 200,
      message: 'ok',
      data: {
        token: `${role}-token`,
        refreshToken: `${role}-refresh-token`,
        expiresAt: Date.now() + 15 * 60 * 1000,
      },
    })
  }

  if (pathname === '/api/auth/profile' && method === 'GET') {
    if (!token) {
      return jsonResponse({ code: 401, message: 'Unauthorized', data: null }, 401)
    }

    return jsonResponse({
      code: 200,
      message: 'ok',
      data: token.includes('editor') ? editorUser : adminUser,
    })
  }

  if (pathname === '/api/auth/access' && method === 'GET') {
    if (!token) {
      return jsonResponse({ code: 401, message: 'Unauthorized', data: null }, 401)
    }

    return jsonResponse({
      code: 200,
      message: 'ok',
      data: accessEntriesByRole(token.includes('editor') ? 'editor' : 'admin'),
    })
  }

  if (!token) {
    return jsonResponse({ code: 401, message: 'Unauthorized', data: null }, 401)
  }

  if (pathname === '/api/dashboard/summary' && method === 'GET') {
    return jsonResponse({
      code: 200,
      message: 'ok',
      data: {
        cards: [
          { label: '活跃用户', value: '12,480', delta: '+8.2%' },
          { label: '本周订单', value: '1,284', delta: '+3.6%' },
          { label: '转化率', value: '7.8%', delta: '+1.1%' },
          { label: '服务器负载', value: '42%', delta: '-4.3%' },
        ],
        trend: [
          ['Mon', 120, 90],
          ['Tue', 132, 110],
          ['Wed', 141, 128],
          ['Thu', 154, 133],
          ['Fri', 170, 150],
          ['Sat', 168, 149],
          ['Sun', 182, 164],
        ],
        channels: [
          { name: '自然流量', value: 42 },
          { name: '转介绍', value: 22 },
          { name: '搜索广告', value: 18 },
          { name: '邮件营销', value: 18 },
        ],
      },
    })
  }

  if (pathname === '/api/system/users' && method === 'GET') {
    const keyword = url.searchParams.get('keyword')?.trim().toLowerCase() ?? ''
    const status = url.searchParams.get('status')?.trim() ?? ''
    const roleCode = url.searchParams.get('roleCode')?.trim() ?? ''
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')

    const filteredUsers = users.filter(item => {
      const keywordMatched = keyword.length === 0
        || item.name.toLowerCase().includes(keyword)
        || item.email.toLowerCase().includes(keyword)
        || item.phone.includes(keyword)
      const statusMatched = status.length === 0 || item.status === status
      const roleMatched = roleCode.length === 0 || item.roleCodes.includes(roleCode)
      return keywordMatched && statusMatched && roleMatched
    })
    const start = (page - 1) * pageSize

    return jsonResponse({
      code: 200,
      message: 'ok',
      data: {
        list: filteredUsers.slice(start, start + pageSize),
        total: filteredUsers.length,
      },
    })
  }

  if (pathname === '/api/system/users' && method === 'POST') {
    const payload = parseJsonBody<SystemUserPayload>(init?.body)
    const validationError = validateUserPayload(payload)

    if (validationError) {
      return jsonResponse({ code: 400, message: validationError, data: null }, 400)
    }

    const normalizedPayload = normalizeUserPayload(payload)
    const nextId = String(Math.max(...users.map(user => Number(user.id))) + 1)
    const user: SystemUser = {
      id: nextId,
      ...normalizedPayload,
      createdAt: timestampLabel(users.length + 1),
      updatedAt: timestampLabel(users.length + 1),
    }

    users.unshift(user)
    userPasswords.set(nextId, 'initial-password-123')

    return jsonResponse({
      code: 200,
      message: 'ok',
      data: user,
    })
  }

  if (pathname === '/api/system/users/status' && method === 'PATCH') {
    const payload = parseJsonBody<SystemUserStatusPayload>(init?.body)

    if (!Array.isArray(payload.ids) || payload.ids.length === 0) {
      return jsonResponse({ code: 400, message: 'User ids are required', data: null }, 400)
    }
    if (!isValidStatus(payload.status)) {
      return jsonResponse({ code: 400, message: 'Status is invalid', data: null }, 400)
    }

    let updatedCount = 0
    payload.ids.forEach(id => {
      const index = findUserIndex(id)
      if (index === -1) {
        return
      }
      users[index] = {
        ...users[index]!,
        status: payload.status,
        updatedAt: timestampLabel(Number(id) + 40),
      }
      updatedCount += 1
    })

    return jsonResponse({
      code: 200,
      message: 'ok',
      data: {
        updatedCount,
      },
    })
  }

  const updateSingleStatusMatch = pathname.match(/^\/api\/system\/users\/([^/]+)\/status$/)
  if (updateSingleStatusMatch && method === 'PATCH') {
    const id = updateSingleStatusMatch[1]!
    const current = getUserOrResponse(id)
    if (current instanceof Response) {
      return current
    }

    const payload = parseJsonBody<{ status?: string }>(init?.body)
    if (!payload.status || !isValidStatus(payload.status)) {
      return jsonResponse({ code: 400, message: 'Status is invalid', data: null }, 400)
    }

    const nextUser: SystemUser = {
      ...current,
      status: payload.status,
      updatedAt: timestampLabel(Number(current.id) + 30),
    }
    users[findUserIndex(id)] = nextUser

    return jsonResponse({
      code: 200,
      message: 'ok',
      data: nextUser,
    })
  }

  const updateUserMatch = pathname.match(/^\/api\/system\/users\/([^/]+)$/)
  if (updateUserMatch && method === 'PATCH') {
    const id = updateUserMatch[1]!
    const current = getUserOrResponse(id)
    if (current instanceof Response) {
      return current
    }

    const payload = parseJsonBody<SystemUserPayload>(init?.body)
    const validationError = validateUserPayload(payload)
    if (validationError) {
      return jsonResponse({ code: 400, message: validationError, data: null }, 400)
    }

    const nextUser: SystemUser = {
      ...current,
      ...normalizeUserPayload(payload),
      updatedAt: timestampLabel(Number(current.id) + 20),
    }

    users[findUserIndex(id)] = nextUser

    return jsonResponse({
      code: 200,
      message: 'ok',
      data: nextUser,
    })
  }

  if (pathname === '/api/system/users/reset-password' && method === 'POST') {
    const payload = parseJsonBody<ResetUserPasswordPayload>(init?.body)

    if (!payload.id) {
      return jsonResponse({ code: 400, message: 'User id is required', data: null }, 400)
    }
    if (!payload.password || payload.password.length < 8) {
      return jsonResponse({ code: 400, message: 'Password must be at least 8 characters', data: null }, 400)
    }
    if (findUserIndex(payload.id) === -1) {
      return jsonResponse({ code: 404, message: 'User not found', data: null }, 404)
    }

    userPasswords.set(payload.id, payload.password)

    return jsonResponse({
      code: 200,
      message: 'ok',
      data: {
        success: true,
      },
    })
  }

  if (pathname === '/api/system/roles' && method === 'GET') {
    return jsonResponse({
      code: 200,
      message: 'ok',
      data: buildRolePolicies(),
    })
  }

  if (pathname === '/api/system/menus' && method === 'GET') {
    return jsonResponse({
      code: 200,
      message: 'ok',
      data: menuRegistry,
    })
  }

  return jsonResponse({ code: 404, message: 'Not Found', data: null }, 404)
}
