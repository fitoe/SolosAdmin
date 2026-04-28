export function useBatchSelection<T extends object>(key: keyof T) {
  const selectedRows = ref<T[]>([])

  const selectedIds = computed<Array<T[keyof T]>>(() =>
    selectedRows.value.map(item => (item as T)[key]),
  )
  const hasSelection = computed(() => selectedRows.value.length > 0)

  function setSelection(rows: T[]) {
    selectedRows.value = rows
  }

  function clearSelection() {
    selectedRows.value = []
  }

  return {
    selectedRows,
    selectedIds,
    hasSelection,
    setSelection,
    clearSelection,
  }
}
