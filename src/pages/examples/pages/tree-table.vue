<script setup lang="ts">
definePage({
  meta: {
    title: '树形表格',
    icon: 'i-ep-share',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin'],
  },
})

interface TreeRow {
  id: number
  name: string
  type: string
  owner: string
  children?: TreeRow[]
}

const rows: TreeRow[] = [
  {
    id: 1,
    name: '系统配置',
    type: '模块',
    owner: '管理员',
    children: [
      { id: 11, name: '用户管理', type: '页面', owner: '管理员' },
      { id: 12, name: '角色管理', type: '页面', owner: '管理员' },
    ],
  },
  {
    id: 2,
    name: '内容中心',
    type: '模块',
    owner: '编辑员',
    children: [
      { id: 21, name: 'Markdown 编辑器', type: '页面', owner: '编辑员' },
      { id: 22, name: '上传资源', type: '页面', owner: '管理员' },
    ],
  },
]
</script>

<template>
  <PageContainer>
    <PageHeader title="树形表格" description="适合模块、资源或组织结构的层级表格页面。" />
    <div class="app-card p-5">
      <ElTable :data="rows" row-key="id" border default-expand-all>
        <ElTableColumn prop="name" label="名称" min-width="220" />
        <ElTableColumn prop="type" label="类型" min-width="140" />
        <ElTableColumn prop="owner" label="负责人" min-width="160" />
        <ElTableColumn label="操作" min-width="180">
          <template #default>
            <div class="flex gap-2">
              <ElButton type="primary" text>编辑</ElButton>
              <ElButton type="danger" text>删除</ElButton>
            </div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </PageContainer>
</template>
