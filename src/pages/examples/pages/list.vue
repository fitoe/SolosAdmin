<script setup lang="ts">
definePage({
  meta: {
    title: 'List Template',
    icon: 'i-ep-list',
    layout: 'admin',
    requiresAuth: true,
  },
})
</script>

<template>
  <PageContainer>
    <PageHeader title="List Template" description="Canonical list layout: filters, toolbar, table, pagination." />
    <QueryPanel title="Filters">
      <ElForm inline>
        <ElFormItem label="Status">
          <ElSelect model-value="all" class="w-36">
            <ElOption label="All" value="all" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </QueryPanel>
    <div class="app-card p-5">
      <DataToolbar>
        <template #left>
          <ElButton type="primary">Create</ElButton>
        </template>
        <template #right>
          <ElButton>Export</ElButton>
        </template>
      </DataToolbar>
      <div class="mt-4">
        <DataTable :columns="[{ key: 'name', title: 'Name' }, { key: 'status', title: 'Status' }]" :rows="[{ name: 'Template Row', status: 'Active' }]" />
      </div>
    </div>
  </PageContainer>
</template>
