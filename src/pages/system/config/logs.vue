<script setup lang="ts">
definePage({
  meta: {
    title: '操作日志',
    icon: 'i-ep-document',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin'],
  },
})

const rows = [
  { actor: '管理员', action: '更新了路由元信息', at: '2026-04-27 16:00' },
  { actor: '编辑员', action: '访问了用户列表', at: '2026-04-27 15:42' },
]
</script>

<template>
  <PageContainer>
    <PageHeader title="操作日志" description="只读明细表格示例页面。" />
    <div class="app-card p-5">
      <DataTable :columns="[{ key: 'actor', title: '操作人' }, { key: 'action', title: '操作内容' }, { key: 'at', title: '时间' }]" :rows="rows" />
    </div>
  </PageContainer>
</template>
