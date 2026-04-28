<script setup lang="ts">
import { useTabsContextMenu } from '@/composables/useTabsContextMenu'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const contextMenu = useTabsContextMenu()
const { visible, x, y, targetTab, open, close: closeContextMenu } = contextMenu
const contextTargetAffix = computed(() => targetTab.value?.affix ?? false)

onMounted(() => {
  window.addEventListener('click', closeContextMenu)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeContextMenu)
})

async function go(fullPath: string) {
  tabsStore.setActiveTab(fullPath)
  await router.push(fullPath)
}

async function close(fullPath: string) {
  tabsStore.closeTab(fullPath)
  if (route.fullPath === fullPath) {
    const lastTab = tabsStore.items.at(-1)
    await router.push(lastTab?.fullPath ?? '/dashboard')
  }
}

async function closeCurrent() {
  const currentTargetTab = targetTab.value
  if (!currentTargetTab) {
    return
  }

  const wasActive = route.fullPath === currentTargetTab.fullPath
  tabsStore.closeCurrentTab(currentTargetTab.fullPath)
  closeContextMenu()

  if (wasActive) {
    await router.push(tabsStore.activeFullPath || '/dashboard')
  }
}

async function closeOthers() {
  const currentTargetTab = targetTab.value
  if (!currentTargetTab) {
    return
  }

  tabsStore.closeOtherTabs(currentTargetTab.fullPath)
  closeContextMenu()
  await router.push(currentTargetTab.fullPath)
}

async function closeRight() {
  const currentTargetTab = targetTab.value
  if (!currentTargetTab) {
    return
  }

  tabsStore.closeRightTabs(currentTargetTab.fullPath)
  closeContextMenu()
  if (!tabsStore.items.some(item => item.fullPath === route.fullPath)) {
    await router.push(currentTargetTab.fullPath)
  }
}

function refreshCurrent() {
  const currentTargetTab = targetTab.value
  if (!currentTargetTab) {
    return
  }

  tabsStore.refreshTab(currentTargetTab.name)
  closeContextMenu()
}
</script>

<template>
  <div class="h-[var(--app-tabs-height)] flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white/72 px-4">
    <button
      v-for="item in tabsStore.items"
      :key="item.fullPath"
      class="flex items-center gap-2 rounded-full border px-3 py-1 text-13px transition"
      :class="
        route.fullPath === item.fullPath
          ? 'border-brand-500 bg-brand-50 text-brand-700'
          : 'border-slate-200 bg-white text-slate-600'
      "
      @click="go(item.fullPath)"
      @contextmenu="open($event, item)"
    >
      <span>{{ item.title }}</span>
      <span v-if="!item.affix" class="i-ep-close text-12px" @click.stop="close(item.fullPath)" />
    </button>
  </div>

  <div
    v-if="visible"
    class="app-tabs-context-menu fixed z-30 min-w-44 overflow-hidden rounded-3 border border-slate-200 bg-white py-1 shadow-xl shadow-slate-200/60"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <button class="app-tabs-context-menu__item" @click.stop="refreshCurrent">
      <span class="i-ep-refresh-right text-14px text-slate-500" />
      <span>刷新当前页</span>
    </button>
    <button
      class="app-tabs-context-menu__item disabled:cursor-not-allowed disabled:text-slate-300"
      :disabled="contextTargetAffix"
      @click.stop="closeCurrent"
    >
      <span class="i-ep-close text-14px text-slate-500" />
      <span>关闭当前页</span>
    </button>
    <button class="app-tabs-context-menu__item" @click.stop="closeOthers">
      <span class="i-ep-remove-filled text-14px text-slate-500" />
      <span>关闭其他页</span>
    </button>
    <button class="app-tabs-context-menu__item" @click.stop="closeRight">
      <span class="i-ep-d-arrow-right text-14px text-slate-500" />
      <span>关闭右侧页</span>
    </button>
  </div>
</template>
