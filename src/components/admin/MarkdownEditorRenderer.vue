<script setup lang="ts">
import { MdEditor, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

defineProps<{
  modelValue: string
  previewOnly?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <MdPreview v-if="previewOnly" editor-id="preview" :model-value="modelValue" />
  <MdEditor
    v-else
    editor-id="editor"
    :model-value="modelValue"
    @update:model-value="value => emit('update:modelValue', value)"
  />
</template>
