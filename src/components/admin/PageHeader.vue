<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <div class="app-card flex items-start justify-between gap-4 p-5">
    <div class="min-w-0">
      <div class="app-title">{{ title }}</div>
      <div v-if="description" class="app-subtitle mt-1">{{ description }}</div>
    </div>
    <div class="flex items-center gap-3">
      <slot name="actions" />
      <ElButton text type="primary" @click="emit('back')">返回</ElButton>
    </div>
  </div>
</template>
