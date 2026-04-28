<script setup lang="ts">
definePage({
  meta: {
    title: 'Configuration',
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
