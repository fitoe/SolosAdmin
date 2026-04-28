<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePage({
  meta: {
    title: '行内编辑',
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
  { id: 1, name: '活动专题页', owner: '管理员', status: 'Active' },
  { id: 2, name: '知识库', owner: '编辑员', status: 'Draft' },
  { id: 3, name: '价格表', owner: '管理员', status: 'Paused' },
])

function startEdit(row: EditableRow) {
  row.editing = true
}

function saveEdit(row: EditableRow) {
  row.editing = false
  ElMessage.success(`已保存：${row.name}`)
}

function cancelEdit(row: EditableRow) {
  row.editing = false
}
</script>

<template>
  <PageContainer>
    <PageHeader title="行内编辑" description="无需离开当前页，直接在表格中切换查看与编辑状态。" />
    <div class="app-card p-5">
      <ElTable :data="rows" border>
        <ElTableColumn prop="name" label="名称" min-width="220">
          <template #default="{ row }">
            <ElInput v-if="row.editing" v-model="row.name" />
            <span v-else>{{ row.name }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="owner" label="负责人" min-width="180">
          <template #default="{ row }">
            <ElSelect v-if="row.editing" v-model="row.owner">
              <ElOption label="管理员" value="管理员" />
              <ElOption label="编辑员" value="编辑员" />
            </ElSelect>
            <span v-else>{{ row.owner }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="status" label="状态" min-width="160">
          <template #default="{ row }">
            <ElSelect v-if="row.editing" v-model="row.status">
              <ElOption label="启用" value="Active" />
              <ElOption label="草稿" value="Draft" />
              <ElOption label="停用" value="Paused" />
            </ElSelect>
            <ElTag v-else :type="row.status === 'Active' ? 'success' : row.status === 'Draft' ? 'warning' : 'info'">
              {{ row.status === 'Active' ? '启用' : row.status === 'Draft' ? '草稿' : '停用' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" min-width="220">
          <template #default="{ row }">
            <div class="flex gap-2">
              <template v-if="row.editing">
                <ElButton type="primary" text @click="saveEdit(row)">保存</ElButton>
                <ElButton text @click="cancelEdit(row)">取消</ElButton>
              </template>
              <template v-else>
                <ElButton type="primary" text @click="startEdit(row)">编辑</ElButton>
                <ElButton type="danger" text>删除</ElButton>
              </template>
            </div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </PageContainer>
</template>
