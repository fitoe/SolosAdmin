<script setup lang="ts">
import * as XLSX from 'xlsx'

definePage({
  meta: {
    title: 'Excel 导入导出',
    icon: 'i-ep-document-copy',
    layout: 'admin',
    requiresAuth: true,
  },
})

const importedRows = ref<Record<string, unknown>[]>([])

function exportExample() {
  const worksheet = XLSX.utils.json_to_sheet([
    { name: '模板数据', status: '启用', owner: '管理员' },
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '用户')
  XLSX.writeFile(workbook, 'solos-admin-template.xlsx')
}

async function importExample(uploadFile: { raw?: File }) {
  if (!uploadFile.raw) {
    return
  }

  const buffer = await uploadFile.raw.arrayBuffer()
  const workbook = XLSX.read(buffer)
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  importedRows.value = XLSX.utils.sheet_to_json(firstSheet)
}
</script>

<template>
  <PageContainer>
    <PageHeader title="Excel 导入导出" description="导出模板数据，并预览导入的表格内容。" />
    <div class="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div class="app-card p-5">
        <div class="mb-4 text-15px font-700 text-slate-800">操作</div>
        <div class="flex flex-col gap-3">
          <ElButton type="primary" @click="exportExample">导出示例文件</ElButton>
          <ElUpload :auto-upload="false" :show-file-list="false" @change="importExample">
            <ElButton plain>导入 Excel</ElButton>
          </ElUpload>
        </div>
      </div>
      <div class="app-card p-5">
        <div class="mb-4 text-15px font-700 text-slate-800">导入结果</div>
        <pre class="overflow-auto rounded-3 bg-slate-950 p-4 text-12px text-slate-100">{{ importedRows }}</pre>
      </div>
    </div>
  </PageContainer>
</template>
