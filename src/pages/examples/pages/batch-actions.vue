<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePage({
  meta: {
    title: 'Batch Actions',
    icon: 'i-ep-finished',
    layout: 'admin',
    requiresAuth: true,
  },
})

interface BatchRow {
  id: number
  name: string
  owner: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

const rows = ref<BatchRow[]>([
  { id: 101, name: 'Article Publish Flow', owner: 'Admin User', status: 'Pending' },
  { id: 102, name: 'Media Library Sync', owner: 'Editor User', status: 'Approved' },
  { id: 103, name: 'Pricing Copy Review', owner: 'Admin User', status: 'Pending' },
  { id: 104, name: 'Banner Asset Refresh', owner: 'Editor User', status: 'Rejected' },
])

const tableRef = useTemplateRef('batchTable')
const { selectedIds, hasSelection, setSelection, clearSelection } = useBatchSelection<BatchRow>('id')

function handleSelectionChange(selection: BatchRow[]) {
  setSelection(selection)
}

function applyBatchStatus(status: BatchRow['status']) {
  rows.value = rows.value.map(row => (selectedIds.value.includes(row.id) ? { ...row, status } : row))
  ElMessage.success(`Updated ${selectedIds.value.length} rows to ${status}`)
  tableRef.value?.clearSelection()
  clearSelection()
}
</script>

<template>
  <PageContainer>
    <PageHeader title="Batch Actions List" description="Bulk selection, status update, and toolbar state driven by selected rows." />
    <div class="app-card flex flex-col gap-4 p-5">
      <DataToolbar>
        <template #left>
          <ElButton type="primary" :disabled="!hasSelection" @click="applyBatchStatus('Approved')">Approve Selected</ElButton>
          <ElButton :disabled="!hasSelection" @click="applyBatchStatus('Rejected')">Reject Selected</ElButton>
          <ElButton type="danger" plain :disabled="!hasSelection" @click="applyBatchStatus('Pending')">Reset to Pending</ElButton>
        </template>
        <template #right>
          <ElTag :type="hasSelection ? 'primary' : 'info'">
            {{ hasSelection ? `${selectedIds.length} selected` : 'No selection' }}
          </ElTag>
        </template>
      </DataToolbar>

      <ElTable ref="batchTable" :data="rows" border @selection-change="handleSelectionChange">
        <ElTableColumn type="selection" width="48" />
        <ElTableColumn prop="name" label="Name" min-width="220" />
        <ElTableColumn prop="owner" label="Owner" min-width="160" />
        <ElTableColumn prop="status" label="Status" min-width="140">
          <template #default="{ row }">
            <ElTag :type="row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : 'warning'">
              {{ row.status }}
            </ElTag>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </PageContainer>
</template>
