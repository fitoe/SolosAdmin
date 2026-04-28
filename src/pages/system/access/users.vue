<script setup lang="ts">
import { usersPageApi } from '@/api/modules/system'

definePage({
  meta: {
    title: '用户管理',
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
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱', width: 220 },
  { key: 'role', title: '角色' },
  { key: 'status', title: '状态' },
  { key: 'updatedAt', title: '更新时间', width: 180 },
]
</script>

<template>
  <PageContainer>
    <PageHeader title="用户管理" description="基于 alova 分页组合式函数的列表页面模板。" />
    <QueryPanel title="筛选条件">
      <ElForm inline>
        <ElFormItem label="关键词">
          <ElInput v-model="query.keyword" placeholder="搜索姓名或邮箱" clearable />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" @click="reload()">查询</ElButton>
          <ElButton @click="reset()">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </QueryPanel>
    <div class="app-card flex flex-col gap-4 p-5">
      <DataToolbar>
        <template #left>
          <PermissionButton type="primary" :permissions="['system:user:edit']">新建用户</PermissionButton>
          <ElButton plain>批量禁用</ElButton>
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
