<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePage({
  meta: {
    title: '批量操作',
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
  { id: 101, name: '文章发布流程', owner: '管理员', status: 'Pending' },
  { id: 102, name: '媒体库同步', owner: '编辑员', status: 'Approved' },
  { id: 103, name: '价格文案复核', owner: '管理员', status: 'Pending' },
  { id: 104, name: '横幅素材更新', owner: '编辑员', status: 'Rejected' },
])

const tableRef = useTemplateRef('batchTable')
const { selectedIds, hasSelection, setSelection, clearSelection } = useBatchSelection<BatchRow>('id')

function handleSelectionChange(selection: BatchRow[]) {
  setSelection(selection)
}

function applyBatchStatus(status: BatchRow['status']) {
  rows.value = rows.value.map(row => (selectedIds.value.includes(row.id) ? { ...row, status } : row))
  const statusLabel = status === 'Approved' ? '已通过' : status === 'Rejected' ? '已驳回' : '待处理'
  ElMessage.success(`已将 ${selectedIds.value.length} 条记录更新为${statusLabel}`)
  tableRef.value?.clearSelection()
  clearSelection()
}
</script>

<template>
  <PageContainer>
    <PageHeader title="批量操作" description="基于选中行驱动工具栏状态，并支持批量更新状态。" />
    <div class="app-card flex flex-col gap-4 p-5">
      <DataToolbar>
        <template #left>
          <ElButton type="primary" :disabled="!hasSelection" @click="applyBatchStatus('Approved')">批量通过</ElButton>
          <ElButton :disabled="!hasSelection" @click="applyBatchStatus('Rejected')">批量驳回</ElButton>
          <ElButton type="danger" plain :disabled="!hasSelection" @click="applyBatchStatus('Pending')">重置为待处理</ElButton>
        </template>
        <template #right>
          <ElTag :type="hasSelection ? 'primary' : 'info'">
            {{ hasSelection ? `已选 ${selectedIds.length} 项` : '未选择数据' }}
          </ElTag>
        </template>
      </DataToolbar>

      <ElTable ref="batchTable" :data="rows" border @selection-change="handleSelectionChange">
        <ElTableColumn type="selection" width="48" />
        <ElTableColumn prop="name" label="名称" min-width="220" />
        <ElTableColumn prop="owner" label="负责人" min-width="160" />
        <ElTableColumn prop="status" label="状态" min-width="140">
          <template #default="{ row }">
            <ElTag :type="row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : 'warning'">
              {{ row.status === 'Approved' ? '已通过' : row.status === 'Rejected' ? '已驳回' : '待处理' }}
            </ElTag>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </PageContainer>
</template>
