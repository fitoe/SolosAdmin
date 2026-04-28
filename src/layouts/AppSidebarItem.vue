<script setup lang="ts">
import type { MenuItem } from '@/router/menu'

defineProps<{
  item: MenuItem
}>()
</script>

<template>
  <ElSubMenu v-if="item.children?.length" :index="item.path">
    <template #title>
      <span class="mr-3" :class="item.icon" />
      <span>{{ item.title }}</span>
    </template>
    <AppSidebarItem v-for="child in item.children" :key="child.path" :item="child" />
  </ElSubMenu>
  <ElMenuItem v-else :index="item.path">
    <span class="mr-3" :class="item.icon" />
    <span>{{ item.title }}</span>
  </ElMenuItem>
</template>
