<script setup lang="ts">
import { useTabsContextMenu } from '@/composables/useTabsContextMenu'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
const contextMenu = useTabsContextMenu()
const contextTargetAffix = computed(() => contextMenu.targetTab.value?.affix ?? false)

onMounted(() => {
  window.addEventListener('click', contextMenu.close)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', contextMenu.close)
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
  const targetTab = contextMenu.targetTab.value
  if (!targetTab) {
    return
  }

  const wasActive = route.fullPath === targetTab.fullPath
  tabsStore.closeCurrentTab(targetTab.fullPath)
  contextMenu.close()

  if (wasActive) {
    await router.push(tabsStore.activeFullPath || '/dashboard')
  }
}

async function closeOthers() {
  const targetTab = contextMenu.targetTab.value
  if (!targetTab) {
    return
  }

  tabsStore.closeOtherTabs(targetTab.fullPath)
  contextMenu.close()
  await router.push(targetTab.fullPath)
}

async function closeRight() {
  const targetTab = contextMenu.targetTab.value
  if (!targetTab) {
    return
  }

  tabsStore.closeRightTabs(targetTab.fullPath)
  contextMenu.close()
  if (!tabsStore.items.some(item => item.fullPath === route.fullPath)) {
    await router.push(targetTab.fullPath)
  }
}

function refreshCurrent() {
  const targetTab = contextMenu.targetTab.value
  if (!targetTab) {
    return
  }

  tabsStore.refreshTab(targetTab.name)
  contextMenu.close()
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
      @contextmenu="contextMenu.open($event, item)"
    >
      <span>{{ item.title }}</span>
      <span v-if="!item.affix" class="i-ep-close text-12px" @click.stop="close(item.fullPath)" />
    </button>
  </div>

  <div
    v-if="contextMenu.visible"
    class="fixed z-30 min-w-40 rounded-3 border border-slate-200 bg-white py-2 shadow-xl shadow-slate-200/60"
    :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
  >
    <button class="w-full px-4 py-2 text-left text-13px text-slate-700 hover:bg-slate-50" @click.stop="refreshCurrent">
      Refresh Current
    </button>
    <button
      class="w-full px-4 py-2 text-left text-13px text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
      :disabled="contextTargetAffix"
      @click.stop="closeCurrent"
    >
      Close Current
    </button>
    <button class="w-full px-4 py-2 text-left text-13px text-slate-700 hover:bg-slate-50" @click.stop="closeOthers">
      Close Others
    </button>
    <button class="w-full px-4 py-2 text-left text-13px text-slate-700 hover:bg-slate-50" @click.stop="closeRight">
      Close Right
    </button>
  </div>
</template>
