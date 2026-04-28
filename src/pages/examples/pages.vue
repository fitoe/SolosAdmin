<script setup lang="ts">
definePage({
  meta: {
    title: '页面模板',
    icon: 'i-ep-files',
    layout: 'admin',
    requiresAuth: true,
  },
})
</script>

<template>
  <RouterView />
</template>
