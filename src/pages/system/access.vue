<script setup lang="ts">
definePage({
  meta: {
    title: '权限管理',
    icon: 'i-ep-lock',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin'],
  },
})
</script>

<template>
  <RouterView />
</template>
