import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { THEME_STORAGE_KEY } from '@/constants/storage'

type ThemeName = 'slate' | 'ocean'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const theme = ref<ThemeName>((localStorage.getItem(THEME_STORAGE_KEY) as ThemeName) || 'slate')

  const sidebarWidth = computed(() =>
    sidebarCollapsed.value ? 'var(--app-sidebar-width-collapsed)' : 'var(--app-sidebar-width)',
  )

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setTheme(nextTheme: ThemeName) {
    theme.value = nextTheme
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  }

  return {
    sidebarCollapsed,
    sidebarWidth,
    theme,
    toggleSidebar,
    setTheme,
  }
})
