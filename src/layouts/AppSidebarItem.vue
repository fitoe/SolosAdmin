<script setup lang="ts">
import type { MenuItem } from '@/router/menu'

defineProps<{
  item: MenuItem
}>()
</script>

<template>
  <ElSubMenu v-if="item.children?.length" :index="item.path">
    <template #title>
      <i class="app-menu-icon" :class="item.icon || 'i-ep-menu'" />
      <span class="app-menu-label">{{ item.title }}</span>
    </template>
    <AppSidebarItem v-for="child in item.children" :key="child.path" :item="child" />
  </ElSubMenu>
  <ElMenuItem v-else :index="item.path">
    <i class="app-menu-icon" :class="item.icon || 'i-ep-menu'" />
    <span class="app-menu-label">{{ item.title }}</span>
  </ElMenuItem>
</template>
