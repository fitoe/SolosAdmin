<script setup lang="ts">
definePage({
  meta: {
    title: 'Content',
    icon: 'i-ep-document',
    layout: 'admin',
    requiresAuth: true,
  },
})
</script>

<template>
  <RouterView />
</template>
