<script setup lang="ts">
const permissionStore = usePermissionStore()
const appStore = useAppStore()
const { activeMenu, openMenus } = useRouteMenu()
</script>

<template>
  <aside
    class="border-r border-slate-200 bg-white/88 backdrop-blur transition-all duration-200"
    :style="{ width: appStore.sidebarWidth }"
  >
    <div class="h-[var(--app-header-height)] flex items-center px-5 text-18px font-700 text-slate-900">
      <span class="i-mdi-shield-crown-outline mr-3 text-24px text-brand-600" />
      <span v-if="!appStore.sidebarCollapsed">Solos Admin</span>
    </div>
    <ElScrollbar height="calc(100vh - var(--app-header-height))">
      <ElMenu
        router
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        :default-active="activeMenu"
        :default-openeds="openMenus"
        class="border-r-0 bg-transparent px-2"
      >
        <AppSidebarItem v-for="item in permissionStore.menuTree" :key="item.path" :item="item" />
      </ElMenu>
    </ElScrollbar>
  </aside>
</template>
