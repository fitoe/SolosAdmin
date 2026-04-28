<script setup lang="ts">
definePage({
  meta: {
    title: 'Operation Logs',
    icon: 'i-ep-document',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin'],
  },
})

const rows = [
  { actor: 'Admin User', action: 'Updated route meta', at: '2026-04-27 16:00' },
  { actor: 'Editor User', action: 'Visited user list', at: '2026-04-27 15:42' },
]
</script>

<template>
  <PageContainer>
    <PageHeader title="Operation Logs" description="Read-only detail table example." />
    <div class="app-card p-5">
      <DataTable :columns="[{ key: 'actor', title: 'Actor' }, { key: 'action', title: 'Action' }, { key: 'at', title: 'At' }]" :rows="rows" />
    </div>
  </PageContainer>
</template>
