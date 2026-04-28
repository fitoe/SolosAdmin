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
    { name: 'Template Row', status: 'Active', owner: 'Admin User' },
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')
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
    <PageHeader title="Excel Utilities" description="Export template rows and import sheets for preview." />
    <div class="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div class="app-card p-5">
        <div class="mb-4 text-15px font-700 text-slate-800">Actions</div>
        <div class="flex flex-col gap-3">
          <ElButton type="primary" @click="exportExample">Export Example File</ElButton>
          <ElUpload :auto-upload="false" :show-file-list="false" @change="importExample">
            <ElButton plain>Import Excel</ElButton>
          </ElUpload>
        </div>
      </div>
      <div class="app-card p-5">
        <div class="mb-4 text-15px font-700 text-slate-800">Imported Rows</div>
        <pre class="overflow-auto rounded-3 bg-slate-950 p-4 text-12px text-slate-100">{{ importedRows }}</pre>
      </div>
    </div>
  </PageContainer>
</template>
