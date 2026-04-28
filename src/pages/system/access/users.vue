<script setup lang="ts">
import { usersPageApi } from '@/api/modules/system'

definePage({
  meta: {
    title: 'Users',
    icon: 'i-ep-user',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin', 'editor'],
    permissions: ['system:user:view'],
    keepAlive: true,
  },
})

const { query, data, loading, reload, reset } = usePageQuery(usersPageApi)

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email', width: 220 },
  { key: 'role', title: 'Role' },
  { key: 'status', title: 'Status' },
  { key: 'updatedAt', title: 'Updated At', width: 180 },
]
</script>

<template>
  <PageContainer>
    <PageHeader title="User Management" description="List page template with alova pagination composable." />
    <QueryPanel title="Filters">
      <ElForm inline>
        <ElFormItem label="Keyword">
          <ElInput v-model="query.keyword" placeholder="Search name or email" clearable />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="reload()">Search</ElButton>
          <ElButton @click="reset()">Reset</ElButton>
        </ElFormItem>
      </ElForm>
    </QueryPanel>
    <div class="app-card flex flex-col gap-4 p-5">
      <DataToolbar>
        <template #left>
          <PermissionButton type="primary" :permissions="['system:user:edit']">New User</PermissionButton>
          <ElButton plain>Batch Disable</ElButton>
        </template>
        <template #right>
          <ElTag>alova</ElTag>
        </template>
      </DataToolbar>
      <DataTable :columns="columns" :rows="data.list" :loading="loading" />
      <div class="flex justify-end">
        <ElPagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          layout="total, prev, pager, next"
          :total="data.total"
          @current-change="reload()"
        />
      </div>
    </div>
  </PageContainer>
</template>
