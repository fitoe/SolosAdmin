<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePage({
  meta: {
    title: 'Inline Edit',
    icon: 'i-ep-edit',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin'],
  },
})

interface EditableRow {
  id: number
  name: string
  owner: string
  status: 'Active' | 'Draft' | 'Paused'
  editing?: boolean
}

const rows = ref<EditableRow[]>([
  { id: 1, name: 'Campaign Alpha', owner: 'Admin User', status: 'Active' },
  { id: 2, name: 'Knowledge Base', owner: 'Editor User', status: 'Draft' },
  { id: 3, name: 'Pricing Table', owner: 'Admin User', status: 'Paused' },
])

function startEdit(row: EditableRow) {
  row.editing = true
}

function saveEdit(row: EditableRow) {
  row.editing = false
  ElMessage.success(`Saved ${row.name}`)
}

function cancelEdit(row: EditableRow) {
  row.editing = false
}
</script>

<template>
  <PageContainer>
    <PageHeader title="Inline Edit Table" description="Table rows can switch between read and edit state without leaving the page." />
    <div class="app-card p-5">
      <ElTable :data="rows" border>
        <ElTableColumn prop="name" label="Name" min-width="220">
          <template #default="{ row }">
            <ElInput v-if="row.editing" v-model="row.name" />
            <span v-else>{{ row.name }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="owner" label="Owner" min-width="180">
          <template #default="{ row }">
            <ElSelect v-if="row.editing" v-model="row.owner">
              <ElOption label="Admin User" value="Admin User" />
              <ElOption label="Editor User" value="Editor User" />
            </ElSelect>
            <span v-else>{{ row.owner }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="status" label="Status" min-width="160">
          <template #default="{ row }">
            <ElSelect v-if="row.editing" v-model="row.status">
              <ElOption label="Active" value="Active" />
              <ElOption label="Draft" value="Draft" />
              <ElOption label="Paused" value="Paused" />
            </ElSelect>
            <ElTag v-else :type="row.status === 'Active' ? 'success' : row.status === 'Draft' ? 'warning' : 'info'">
              {{ row.status }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="Actions" min-width="220">
          <template #default="{ row }">
            <div class="flex gap-2">
              <template v-if="row.editing">
                <ElButton type="primary" text @click="saveEdit(row)">Save</ElButton>
                <ElButton text @click="cancelEdit(row)">Cancel</ElButton>
              </template>
              <template v-else>
                <ElButton type="primary" text @click="startEdit(row)">Edit</ElButton>
                <ElButton type="danger" text>Delete</ElButton>
              </template>
            </div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </PageContainer>
</template>
