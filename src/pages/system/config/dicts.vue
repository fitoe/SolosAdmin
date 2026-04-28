<script setup lang="ts">
definePage({
  meta: {
    title: 'Dictionaries',
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
    <PageHeader title="Dictionary Config" description="Simple reusable CRUD shell page." />
    <div class="app-card p-5">
      <DataTable :columns="[{ key: 'key', title: 'Key' }, { key: 'value', title: 'Values' }]" :rows="rows" />
    </div>
  </PageContainer>
</template>
