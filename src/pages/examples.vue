<script setup lang="ts">
definePage({
  meta: {
    title: '示例中心',
    icon: 'i-ep-grid',
    layout: 'admin',
    requiresAuth: true,
  },
})
</script>

<template>
  <RouterView />
</template>
