<script setup lang="ts">
definePage({
  meta: {
    title: 'System',
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
