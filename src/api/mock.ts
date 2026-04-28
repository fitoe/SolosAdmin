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
  name: 'Admin User',
  role: 'admin',
  roles: ['admin'],
  permissions: ['system:user:view', 'system:user:edit', 'system:role:view', 'system:menu:view'],
  avatar: 'AU',
}

const editorUser: UserProfile = {
  id: '2',
  name: 'Editor User',
  role: 'editor',
  roles: ['editor'],
  permissions: ['system:user:view'],
  avatar: 'EU',
}

const rolePolicies: RolePolicy[] = [
  {
    name: 'Admin',
    code: 'admin',
    description: 'Owns full navigation and system configuration pages.',
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
      '/examples/pages/list',
      '/examples/pages/form',
      '/examples/pages/detail',
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
    name: 'Editor',
    code: 'editor',
    description: 'Can browse content pages and the user list, but no system config.',
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
  { routeKey: '/dashboard', title: 'Dashboard', path: '/dashboard', level: 1, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/system', title: 'System', path: '/system', level: 1, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/system/access', title: 'Access', path: '/system/access', level: 2, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/system/access/users', title: 'Users', path: '/system/access/users', level: 3, roles: ['admin', 'editor'], permissions: ['system:user:view'], enabled: true, order: 10 },
  { routeKey: '/system/access/roles', title: 'Roles', path: '/system/access/roles', level: 3, roles: ['admin'], permissions: ['system:role:view'], enabled: true, order: 20 },
  { routeKey: '/system/config', title: 'Configuration', path: '/system/config', level: 2, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/system/config/menus', title: 'Menus', path: '/system/config/menus', level: 3, roles: ['admin'], permissions: ['system:menu:view'], enabled: true, order: 10 },
  { routeKey: '/system/config/dicts', title: 'Dictionaries', path: '/system/config/dicts', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/system/config/logs', title: 'Operation Logs', path: '/system/config/logs', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 30 },
  { routeKey: '/examples', title: 'Examples', path: '/examples', level: 1, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 30 },
  { routeKey: '/examples/pages', title: 'Page Templates', path: '/examples/pages', level: 2, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/examples/pages/list', title: 'List Template', path: '/examples/pages/list', level: 3, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/examples/pages/form', title: 'Form Template', path: '/examples/pages/form', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/examples/pages/detail', title: 'Detail Template', path: '/examples/pages/detail', level: 3, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 30 },
  { routeKey: '/examples/visual', title: 'Visual', path: '/examples/visual', level: 2, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/examples/visual/charts', title: 'Charts', path: '/examples/visual/charts', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/examples/content', title: 'Content', path: '/examples/content', level: 2, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 30 },
  { routeKey: '/examples/content/markdown', title: 'Markdown Editor', path: '/examples/content/markdown', level: 3, roles: ['admin', 'editor'], permissions: [], enabled: true, order: 10 },
  { routeKey: '/examples/content/uploads', title: 'Uploads', path: '/examples/content/uploads', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 20 },
  { routeKey: '/examples/content/excel', title: 'Excel Import/Export', path: '/examples/content/excel', level: 3, roles: ['admin'], permissions: [], enabled: true, order: 30 },
]

const accessEntriesByRole: Record<UserProfile['role'], BackendAccessEntry[]> = {
  admin: menuRegistry.map(({ routeKey, title, order }) => ({ routeKey, title, order })),
  editor: menuRegistry
    .filter(item => item.roles.includes('editor'))
    .map(({ routeKey, title, order }) => ({ routeKey, title, order })),
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function createMockFetch(input: RequestInfo | URL, init?: RequestInit) {
  const rawUrl = String(input)
  const url = new URL(rawUrl.startsWith('http') ? rawUrl : `https://mock.local${rawUrl}`)
  const pathname = url.pathname
  const method = (init?.method ?? 'GET').toUpperCase()
  const token = init?.headers instanceof Headers ? init.headers.get('authorization') : null

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
          { label: 'Active Users', value: '12,480', delta: '+8.2%' },
          { label: 'Weekly Orders', value: '1,284', delta: '+3.6%' },
          { label: 'Conversion', value: '7.8%', delta: '+1.1%' },
          { label: 'Server Load', value: '42%', delta: '-4.3%' },
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
          { name: 'Organic', value: 42 },
          { name: 'Referral', value: 22 },
          { name: 'Search Ads', value: 18 },
          { name: 'Email', value: 18 },
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
