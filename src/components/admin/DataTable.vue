<script setup lang="ts" generic="T extends object">
export interface ColumnConfig {
  key: string
  title: string
  width?: number
}

defineProps<{
  loading?: boolean
  columns: ColumnConfig[]
  rows: T[]
}>()
</script>

<template>
  <ElTable :data="rows" :loading="loading" border>
    <ElTableColumn
      v-for="column in columns"
      :key="column.key"
      :prop="column.key"
      :label="column.title"
      :min-width="column.width ?? 140"
      show-overflow-tooltip
    />
    <slot />
  </ElTable>
</template>
