import type { BackendAccessEntry, MenuRegistryItem, RolePolicy, UserProfile } from '@/types/app'

const users = Array.from({ length: 28 }, (_, index) => ({
  id: `${index + 1}`,
  name: `User ${index + 1}`,
  email: `user${index + 1}@solos.dev`,
  role: index % 3 === 0 ? 'Admin' : 'Editor',
  status: index % 4 === 0 ? 'Disabled' : 'Active',
  updatedAt: `2026-04-${String((index % 9) + 10).padStart(2, '0')} 10:${String(index % 6).padStart(2, '0')}`,
}))

const adminUser: UserProfile = {
  id: '1',
  name: '管理员',
  role: 'admin',
  roles: ['admin'],
  permissions: ['system:user:view', 'system:user:edit', 'system:role:view', 'system:menu:view'],
  avatar: 'AU',
}

const editorUser: UserProfile = {
  id: '2',
  name: '编辑员',
  role: 'editor',
  roles: ['editor'],
  permissions: ['system:user:view'],
  avatar: 'EU',
}

const rolePolicies: RolePolicy[] = [
  {
    name: '管理员',
    code: 'admin',
    description: '拥有全部导航和系统配置页面权限。',
    members: 4,
    routeKeys: [
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
    ],
    permissionKeys: adminUser.permissions,
  },
  {
    name: '编辑员',
    code: 'editor',
    description: '可查看内容页面和用户列表，但不可进入系统配置。',
    members: 12,
    routeKeys: [
      '/dashboard',
      '/system',
      '/system/access',
      '/system/access/users',
      '/examples',
      '/examples/pages',
      '/examples/pages/list',
      '/examples/pages/detail',
      '/examples/content',
      '/examples/content/markdown',
      '/profile',
    ],
    permissionKeys: editorUser.permissions,
  },
]

const menuRegistry: MenuRegistryItem[] = [
  { routeKey: '/dashboard', title: '工作台', path: '/dashboard', level: 1, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/system', title: '系统管理', path: '/system', level: 1, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/system/access', title: '权限管理', path: '/system/access', level: 2, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/system/access/users', title: '用户管理', path: '/system/access/users', level: 3, roles: ['admin', 'editor'], permissions: ['system:user:view'], enabled: true, order: 10 },
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

const accessEntriesByRole: Record<UserProfile['role'], BackendAccessEntry[]> = {
  admin: buildAccessEntries(rolePolicies[0].routeKeys),
  editor: buildAccessEntries(rolePolicies[1].routeKeys),
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
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

export async function createMockFetch(input: RequestInfo | URL, init?: RequestInit) {
  const rawUrl = String(input)
  const url = new URL(rawUrl.startsWith('http') ? rawUrl : `https://mock.local${rawUrl}`)
  const pathname = url.pathname
  const method = (init?.method ?? 'GET').toUpperCase()
  const token = readAuthorizationHeader(init?.headers)

  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : {}
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
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : {}
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
      data: token.includes('editor') ? accessEntriesByRole.editor : accessEntriesByRole.admin,
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
    const keyword = url.searchParams.get('keyword')?.toLowerCase() ?? ''
    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10')
    const filteredUsers = users.filter(
      item => item.name.toLowerCase().includes(keyword) || item.email.toLowerCase().includes(keyword),
    )
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

  if (pathname === '/api/system/roles' && method === 'GET') {
    return jsonResponse({
      code: 200,
      message: 'ok',
      data: rolePolicies,
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
