<script setup lang="ts">
definePage({
  meta: {
    title: '高级搜索',
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
    <PageHeader title="高级搜索" description="带多种字段类型和状态筛选的扩展查询表单。" />
    <QueryPanel title="搜索条件">
      <ElForm label-position="top">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ElFormItem label="关键词">
            <ElInput v-model="filters.keyword" placeholder="名称 / 负责人 / 分类" clearable />
          </ElFormItem>
          <ElFormItem label="负责人">
            <ElSelect v-model="filters.owner" placeholder="选择负责人" clearable>
              <ElOption label="管理员" value="Admin User" />
              <ElOption label="编辑员" value="Editor User" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="状态">
            <ElSelect v-model="filters.status" multiple placeholder="选择状态" clearable>
              <ElOption label="启用" value="Active" />
              <ElOption label="草稿" value="Draft" />
              <ElOption label="归档" value="Archived" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="日期范围">
            <ElDatePicker
              v-model="filters.dateRange"
              type="daterange"
              value-format="YYYY-MM-DD"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </ElFormItem>
        </div>
        <div class="flex items-center gap-3">
          <ElButton type="primary">查询</ElButton>
          <ElButton @click="reset">重置</ElButton>
        </div>
      </ElForm>
    </QueryPanel>
    <div class="app-card flex flex-col gap-4 p-5">
      <DataToolbar>
        <template #left>
          <ElTag type="primary">高级搜索模板</ElTag>
        </template>
        <template #right>
          <ElButton plain>保存筛选</ElButton>
        </template>
      </DataToolbar>
      <DataTable
        :columns="[
          { key: 'name', title: '名称', width: 220 },
          { key: 'owner', title: '负责人' },
          { key: 'status', title: '状态' },
          { key: 'category', title: '分类' },
          { key: 'updatedAt', title: '更新时间', width: 180 },
        ]"
        :rows="rows"
      />
    </div>
  </PageContainer>
</template>
