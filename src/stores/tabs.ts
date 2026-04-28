import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { TAB_STORAGE_KEY } from '@/constants/storage'

export interface TabItem {
  fullPath: string
  path: string
  name: string
  title: string
  affix: boolean
  keepAlive: boolean
}

function readPersistedTabs() {
  const rawValue = localStorage.getItem(TAB_STORAGE_KEY)
  if (!rawValue) {
    return [] as TabItem[]
  }

  try {
    return JSON.parse(rawValue) as TabItem[]
  } catch {
    return []
  }
}

export const useTabsStore = defineStore('tabs', () => {
  const items = ref<TabItem[]>(readPersistedTabs())
  const activeFullPath = ref('')
  const refreshTokens = ref<Record<string, number>>({})

  const keepAliveNames = computed(() =>
    items.value.filter(item => item.keepAlive).map(item => item.name),
  )

  function persist() {
    localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(items.value))
  }

  function openTab(tab: TabItem) {
    const existing = items.value.find(item => item.fullPath === tab.fullPath)
    if (existing) {
      Object.assign(existing, tab)
    } else {
      items.value.push(tab)
    }
    activeFullPath.value = tab.fullPath
    persist()
  }

  function closeTab(fullPath: string) {
    items.value = items.value.filter(item => item.affix || item.fullPath !== fullPath)
    persist()
  }

  function closeOtherTabs(fullPath: string) {
    items.value = items.value.filter(item => item.affix || item.fullPath === fullPath)
    activeFullPath.value = fullPath
    persist()
  }

  function closeRightTabs(fullPath: string) {
    const activeIndex = items.value.findIndex(item => item.fullPath === fullPath)
    if (activeIndex < 0) {
      return
    }

    items.value = items.value.filter((item, index) => item.affix || index <= activeIndex)
    persist()
  }

  function restoreTabs() {
    items.value = readPersistedTabs()
  }

  function setActiveTab(fullPath: string) {
    activeFullPath.value = fullPath
  }

  function closeCurrentTab(fullPath: string) {
    const nextItems = items.value.filter(item => item.affix || item.fullPath !== fullPath)
    if (nextItems.length === items.value.length) {
      return
    }

    items.value = nextItems
    activeFullPath.value = items.value.at(-1)?.fullPath ?? ''
    persist()
  }

  function refreshTab(name: string) {
    refreshTokens.value = {
      ...refreshTokens.value,
      [name]: (refreshTokens.value[name] ?? 0) + 1,
    }
  }

  function getRefreshToken(name: string) {
    return refreshTokens.value[name] ?? 0
  }

  function clear() {
    items.value = []
    activeFullPath.value = ''
    refreshTokens.value = {}
    localStorage.removeItem(TAB_STORAGE_KEY)
  }

  return {
    items,
    activeFullPath,
    keepAliveNames,
    openTab,
    closeTab,
    closeOtherTabs,
    closeRightTabs,
    restoreTabs,
    setActiveTab,
    closeCurrentTab,
    refreshTab,
    getRefreshToken,
    clear,
  }
})
