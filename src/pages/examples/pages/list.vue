<script setup lang="ts">
definePage({
  meta: {
    title: '列表模板',
    icon: 'i-ep-list',
    layout: 'admin',
    requiresAuth: true,
  },
})
</script>

<template>
  <PageContainer>
    <PageHeader title="列表模板" description="标准列表布局：筛选、工具栏、表格与分页。" />
    <QueryPanel title="筛选条件">
      <ElForm inline>
        <ElFormItem label="状态">
          <ElSelect model-value="all" class="w-36">
            <ElOption label="全部" value="all" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </QueryPanel>
    <div class="app-card p-5">
      <DataToolbar>
        <template #left>
          <ElButton type="primary">新建</ElButton>
        </template>
        <template #right>
          <ElButton>导出</ElButton>
        </template>
      </DataToolbar>
      <div class="mt-4">
        <DataTable :columns="[{ key: 'name', title: '名称' }, { key: 'status', title: '状态' }]" :rows="[{ name: '模板数据', status: '启用' }]" />
      </div>
    </div>
  </PageContainer>
</template>
