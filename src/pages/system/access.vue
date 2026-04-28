<script setup lang="ts">
definePage({
  meta: {
    title: 'Access',
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
