<script setup lang="ts" generic="T extends object">
export interface ColumnConfig {
  key: string
  title: string
  width?: number
}

const props = defineProps<{
  loading?: boolean
  columns: ColumnConfig[]
  rows: T[]
  selectable?: boolean
  rowKey?: string
}>()

const emit = defineEmits<{
  selectionChange: [rows: T[]]
}>()

const tableRef = ref<{ clearSelection: () => void } | null>(null)

function handleSelectionChange(rows: unknown[]) {
  emit('selectionChange', rows as T[])
}

function clearSelection() {
  tableRef.value?.clearSelection()
}

defineExpose({
  clearSelection,
})
</script>

<template>
  <ElTable
    ref="tableRef"
    :data="props.rows"
    :loading="props.loading"
    :row-key="props.rowKey"
    border
    @selection-change="handleSelectionChange"
  >
    <ElTableColumn v-if="props.selectable" type="selection" width="48" />
    <ElTableColumn
      v-for="column in props.columns"
      :key="column.key"
      :prop="column.key"
      :label="column.title"
      :min-width="column.width ?? 140"
      show-overflow-tooltip
    />
    <slot />
  </ElTable>
</template>
