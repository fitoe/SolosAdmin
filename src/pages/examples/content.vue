<script setup lang="ts">
definePage({
  meta: {
    title: '内容管理',
    icon: 'i-ep-document',
    layout: 'admin',
    requiresAuth: true,
  },
})
</script>

<template>
  <RouterView />
</template>
