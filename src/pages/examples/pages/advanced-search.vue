<script setup lang="ts">
definePage({
  meta: {
    title: 'Advanced Search',
    icon: 'i-ep-search',
    layout: 'admin',
    requiresAuth: true,
  },
})

const filters = reactive({
  keyword: '',
  owner: '',
  status: [] as string[],
  dateRange: [] as string[],
})

const rows = computed(() => {
  const dataset = [
    { name: 'Campaign Alpha', owner: 'Admin User', status: 'Active', category: 'Marketing', updatedAt: '2026-04-26 12:08' },
    { name: 'Knowledge Base', owner: 'Editor User', status: 'Draft', category: 'Content', updatedAt: '2026-04-25 09:22' },
    { name: 'Product Pricing', owner: 'Admin User', status: 'Archived', category: 'Finance', updatedAt: '2026-04-24 18:40' },
  ]

  return dataset.filter(item => {
    const keywordMatch =
      filters.keyword.length === 0 ||
      [item.name, item.owner, item.category].some(value => value.toLowerCase().includes(filters.keyword.toLowerCase()))
    const ownerMatch = filters.owner.length === 0 || item.owner === filters.owner
    const statusMatch = filters.status.length === 0 || filters.status.includes(item.status)
    return keywordMatch && ownerMatch && statusMatch
  })
})

function reset() {
  filters.keyword = ''
  filters.owner = ''
  filters.status = []
  filters.dateRange = []
}
</script>

<template>
  <PageContainer>
    <PageHeader title="Advanced Search" description="Expanded search form with multiple field types and stateful filtering." />
    <QueryPanel title="Search Filters">
      <ElForm label-position="top">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ElFormItem label="Keyword">
            <ElInput v-model="filters.keyword" placeholder="Name / owner / category" clearable />
          </ElFormItem>
          <ElFormItem label="Owner">
            <ElSelect v-model="filters.owner" placeholder="Select owner" clearable>
              <ElOption label="Admin User" value="Admin User" />
              <ElOption label="Editor User" value="Editor User" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="Status">
            <ElSelect v-model="filters.status" multiple placeholder="Select status" clearable>
              <ElOption label="Active" value="Active" />
              <ElOption label="Draft" value="Draft" />
              <ElOption label="Archived" value="Archived" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="Date Range">
            <ElDatePicker
              v-model="filters.dateRange"
              type="daterange"
              value-format="YYYY-MM-DD"
              start-placeholder="Start"
              end-placeholder="End"
            />
          </ElFormItem>
        </div>
        <div class="flex items-center gap-3">
          <ElButton type="primary">Search</ElButton>
          <ElButton @click="reset">Reset</ElButton>
        </div>
      </ElForm>
    </QueryPanel>
    <div class="app-card flex flex-col gap-4 p-5">
      <DataToolbar>
        <template #left>
          <ElTag type="primary">Advanced Search Pattern</ElTag>
        </template>
        <template #right>
          <ElButton plain>Save Filter</ElButton>
        </template>
      </DataToolbar>
      <DataTable
        :columns="[
          { key: 'name', title: 'Name', width: 220 },
          { key: 'owner', title: 'Owner' },
          { key: 'status', title: 'Status' },
          { key: 'category', title: 'Category' },
          { key: 'updatedAt', title: 'Updated At', width: 180 },
        ]"
        :rows="rows"
      />
    </div>
  </PageContainer>
</template>
