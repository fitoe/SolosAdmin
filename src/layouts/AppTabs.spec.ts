import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { reactive } from 'vue'

import AppTabs from './AppTabs.vue'
import { useTabsStore } from '@/stores/tabs'

const mockRoute = reactive({
  fullPath: '/dashboard',
})

const mockRouter = {
  push: vi.fn(),
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}))

describe('AppTabs', () => {
  beforeEach(() => {
    localStorage.clear()
    mockRoute.fullPath = '/dashboard'
    mockRouter.push.mockReset()
    setActivePinia(createPinia())
  })

  it('hides context menu actions until a tab is right-clicked', async () => {
    const tabsStore = useTabsStore()
    tabsStore.openTab({
      fullPath: '/dashboard',
      path: '/dashboard',
      name: 'dashboard',
      title: 'Dashboard',
      affix: true,
      keepAlive: true,
    })

    const wrapper = mount(AppTabs, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.text()).not.toContain('Refresh Current')

    await wrapper.get('button').trigger('contextmenu', {
      clientX: 120,
      clientY: 48,
    })

    expect(wrapper.text()).toContain('刷新当前页')
    expect(wrapper.text()).toContain('关闭当前页')
  })
})
