<script setup lang="ts">
const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const breadcrumbs = computed(() => route.matched.filter(item => item.meta.title && !item.meta.hidden))
const { visible, keyword, results, open, close, go } = useGlobalSearch()
const { isFullscreen, toggle } = useFullscreen()

async function handleLogout() {
  userStore.logout()
  await router.push('/login')
}
</script>

<template>
  <header class="h-[var(--app-header-height)] flex items-center justify-between border-b border-slate-200 bg-white/72 px-6 backdrop-blur">
    <div class="flex min-w-0 items-center gap-4">
      <ElButton circle text @click="appStore.toggleSidebar()">
        <span class="i-ep-expand" />
      </ElButton>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem v-for="item in breadcrumbs" :key="item.path">
          {{ item.meta.title }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="flex items-center gap-2">
      <ElTooltip content="Search">
        <ElButton circle text @click="open()">
          <span class="i-ep-search" />
        </ElButton>
      </ElTooltip>
      <ElTooltip content="Fullscreen">
        <ElButton circle text @click="toggle()">
          <span :class="isFullscreen ? 'i-ep-close-bold' : 'i-ep-full-screen'" />
        </ElButton>
      </ElTooltip>
      <ElTooltip content="Notifications">
        <ElButton circle text>
          <span class="i-ep-bell" />
        </ElButton>
      </ElTooltip>
      <ElDropdown>
        <div class="flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5">
          <ElAvatar :size="30">{{ userStore.profile?.avatar ?? 'SA' }}</ElAvatar>
          <div class="text-right">
            <div class="text-13px font-600 text-slate-800">{{ userStore.profile?.name ?? 'Guest' }}</div>
            <div class="text-12px text-slate-500">{{ userStore.profile?.role ?? 'none' }}</div>
          </div>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="router.push('/profile')">Profile</ElDropdownItem>
            <ElDropdownItem divided @click="handleLogout">Logout</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </header>

  <ElDialog v-model="visible" width="560px" align-center title="Global Search" @close="close()">
    <ElInput
      v-model="keyword"
      placeholder="Search route or page"
      size="large"
      clearable
    />
    <div class="mt-4 flex max-h-72 flex-col gap-2 overflow-auto">
      <button
        v-for="item in results"
        :key="item.path"
        class="flex items-center justify-between rounded-3 p-3 text-left transition hover:bg-slate-50"
        @click="go(item.path)"
      >
        <span class="flex items-center gap-3">
          <span :class="item.icon" />
          <span>{{ item.title }}</span>
        </span>
        <span class="text-12px text-slate-400">{{ item.path }}</span>
      </button>
    </div>
  </ElDialog>
</template>
