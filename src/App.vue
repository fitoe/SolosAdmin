<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <component :is="route.meta.layout === 'blank' ? BlankLayout : AdminLayout">
      <component :is="Component" />
    </component>
  </RouterView>
</template>
