import type { TabItem } from '@/stores/tabs'

export function useTabsContextMenu() {
  const visible = ref(false)
  const x = ref(0)
  const y = ref(0)
  const targetTab = ref<TabItem | null>(null)

  function open(event: MouseEvent, tab: TabItem) {
    event.preventDefault()
    visible.value = true
    x.value = event.clientX
    y.value = event.clientY
    targetTab.value = tab
  }

  function close() {
    visible.value = false
    targetTab.value = null
  }

  return {
    visible,
    x,
    y,
    targetTab,
    open,
    close,
  }
}
