<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="app-card p-5">
    <div class="mb-4 text-15px font-700 text-slate-800">{{ title }}</div>
    <slot />
  </div>
</template>
