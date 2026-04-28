<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="app-card p-5">
    <div v-if="title" class="mb-4 text-14px font-600 text-slate-700">{{ title }}</div>
    <slot />
  </div>
</template>
