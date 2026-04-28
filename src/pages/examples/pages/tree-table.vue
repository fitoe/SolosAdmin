<script setup lang="ts">
definePage({
  meta: {
    title: 'Tree Table',
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
    name: 'System Configuration',
    type: 'Module',
    owner: 'Admin User',
    children: [
      { id: 11, name: 'User Management', type: 'Page', owner: 'Admin User' },
      { id: 12, name: 'Role Management', type: 'Page', owner: 'Admin User' },
    ],
  },
  {
    id: 2,
    name: 'Content Center',
    type: 'Module',
    owner: 'Editor User',
    children: [
      { id: 21, name: 'Markdown Editor', type: 'Page', owner: 'Editor User' },
      { id: 22, name: 'Upload Assets', type: 'Page', owner: 'Admin User' },
    ],
  },
]
</script>

<template>
  <PageContainer>
    <PageHeader title="Tree Table" description="Hierarchical page for nested resources, modules, or organizations." />
    <div class="app-card p-5">
      <ElTable :data="rows" row-key="id" border default-expand-all>
        <ElTableColumn prop="name" label="Name" min-width="220" />
        <ElTableColumn prop="type" label="Type" min-width="140" />
        <ElTableColumn prop="owner" label="Owner" min-width="160" />
        <ElTableColumn label="Actions" min-width="180">
          <template #default>
            <div class="flex gap-2">
              <ElButton type="primary" text>Edit</ElButton>
              <ElButton type="danger" text>Delete</ElButton>
            </div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </PageContainer>
</template>
