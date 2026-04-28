<script setup lang="ts">
definePage({
  meta: {
    title: '系统配置',
    icon: 'i-ep-setting',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin'],
  },
})
</script>

<template>
  <RouterView />
</template>
