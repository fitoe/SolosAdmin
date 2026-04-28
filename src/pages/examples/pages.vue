<script setup lang="ts">
definePage({
  meta: {
    title: 'Page Templates',
    icon: 'i-ep-files',
    layout: 'admin',
    requiresAuth: true,
  },
})
</script>

<template>
  <RouterView />
</template>
