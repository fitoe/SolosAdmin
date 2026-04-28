<script setup lang="ts">
definePage({
  meta: {
    title: '字典配置',
    icon: 'i-ep-collection-tag',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin'],
  },
})

const rows = [
  { key: 'status', value: 'active / disabled' },
  { key: 'role', value: 'admin / editor' },
]
</script>

<template>
  <PageContainer>
    <PageHeader title="字典配置" description="简洁可复用的 CRUD 壳层页面示例。" />
    <div class="app-card p-5">
      <DataTable :columns="[{ key: 'key', title: '键' }, { key: 'value', title: '值' }]" :rows="rows" />
    </div>
  </PageContainer>
</template>
