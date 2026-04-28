<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

defineProps<{
  modelValue: string
  previewOnly?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const MarkdownEditorRenderer = defineAsyncComponent(() => import('./MarkdownEditorRenderer.vue'))
</script>

<template>
  <Suspense>
    <MarkdownEditorRenderer
      :model-value="modelValue"
      :preview-only="previewOnly"
      @update:model-value="value => emit('update:modelValue', value)"
    />
    <template #fallback>
      <ElSkeleton animated>
        <ElSkeletonItem variant="image" style="height: 420px;" />
      </ElSkeleton>
    </template>
  </Suspense>
</template>
