<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

defineProps<{
  title: string
  option: Record<string, unknown>
  height?: string
}>()

const ChartRenderer = defineAsyncComponent(() => import('./ChartRenderer.vue'))
</script>

<template>
  <div class="app-card p-5">
    <div class="mb-4 text-15px font-700 text-slate-800">{{ title }}</div>
    <Suspense>
      <ChartRenderer :option="option" :height="height" />
      <template #fallback>
        <ElSkeleton animated>
          <ElSkeletonItem variant="image" style="height: 320px;" />
        </ElSkeleton>
      </template>
    </Suspense>
  </div>
</template>
