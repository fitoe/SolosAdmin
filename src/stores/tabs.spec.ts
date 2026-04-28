import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { TAB_STORAGE_KEY } from '@/constants/storage'

import { useTabsStore } from './tabs'

describe('tabs store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('adds tabs, persists state, and protects affix tab', () => {
    const tabs = useTabsStore()

    tabs.openTab({
      fullPath: '/dashboard',
      path: '/dashboard',
      name: 'dashboard',
      title: 'Dashboard',
      affix: true,
      keepAlive: true,
    })
    tabs.openTab({
      fullPath: '/system/users',
      path: '/system/users',
      name: 'users',
      title: 'Users',
      affix: false,
      keepAlive: false,
    })

    tabs.closeTab('/dashboard')

    expect(tabs.items).toHaveLength(2)
    expect(tabs.keepAliveNames).toEqual(['dashboard'])
    expect(JSON.parse(localStorage.getItem(TAB_STORAGE_KEY) ?? '[]')).toHaveLength(2)
  })

  it('closes other tabs and right-side tabs', () => {
    const tabs = useTabsStore()

    tabs.openTab({ fullPath: '/dashboard', path: '/dashboard', name: 'dashboard', title: 'Dashboard', affix: true, keepAlive: true })
    tabs.openTab({ fullPath: '/charts', path: '/charts', name: 'charts', title: 'Charts', affix: false, keepAlive: false })
    tabs.openTab({ fullPath: '/markdown', path: '/markdown', name: 'markdown', title: 'Markdown', affix: false, keepAlive: true })

    tabs.closeOtherTabs('/charts')
    expect(tabs.items.map(item => item.name)).toEqual(['dashboard', 'charts'])

    tabs.openTab({ fullPath: '/markdown', path: '/markdown', name: 'markdown', title: 'Markdown', affix: false, keepAlive: true })
    tabs.closeRightTabs('/charts')
    expect(tabs.items.map(item => item.name)).toEqual(['dashboard', 'charts'])
  })

  it('tracks active tab and closes current tab safely', () => {
    const tabs = useTabsStore()

    tabs.openTab({ fullPath: '/dashboard', path: '/dashboard', name: 'dashboard', title: 'Dashboard', affix: true, keepAlive: true })
    tabs.openTab({ fullPath: '/users', path: '/users', name: 'users', title: 'Users', affix: false, keepAlive: false })
    tabs.setActiveTab('/users')
    tabs.closeCurrentTab('/users')

    expect(tabs.activeFullPath).toBe('/dashboard')
    expect(tabs.items.map(item => item.name)).toEqual(['dashboard'])
  })

  it('refreshes tab by bumping reload token and ignores affix close', () => {
    const tabs = useTabsStore()

    tabs.openTab({ fullPath: '/dashboard', path: '/dashboard', name: 'dashboard', title: 'Dashboard', affix: true, keepAlive: true })
    tabs.openTab({ fullPath: '/markdown', path: '/markdown', name: 'markdown', title: 'Markdown', affix: false, keepAlive: true })

    tabs.refreshTab('markdown')
    tabs.closeCurrentTab('/dashboard')

    expect(tabs.getRefreshToken('markdown')).toBe(1)
    expect(tabs.items.map(item => item.name)).toEqual(['dashboard', 'markdown'])
  })
})
