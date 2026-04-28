<script setup lang="ts">
import type { RolePolicy, SystemUser, SystemUserPayload, SystemUserStatus } from '@/types/app'

import { ElMessage, ElMessageBox } from 'element-plus'

import { useRequest } from '@/api/client'
import {
  batchUpdateUserStatusApi,
  createUserApi,
  resetUserPasswordApi,
  rolesRegistryApi,
  updateUserApi,
  updateUserStatusApi,
  usersPageApi,
} from '@/api/modules/system'

definePage({
  meta: {
    title: '用户管理',
    icon: 'i-ep-user',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin'],
    permissions: ['system:user:view'],
    keepAlive: true,
  },
})

const { can } = usePermission()
const tableRef = useTemplateRef<{ clearSelection: () => void }>('usersTable')
const { selectedIds, hasSelection, setSelection, clearSelection } = useBatchSelection<SystemUser>('id')
const { query, data, loading, reload, reset } = usePageQuery(usersPageApi)

const formVisible = ref(false)
const formSubmitting = ref(false)
const currentUser = ref<SystemUser | null>(null)

const resetPasswordVisible = ref(false)
const passwordSubmitting = ref(false)
const passwordUser = ref<SystemUser | null>(null)

const columns = [
  { key: 'name', title: '姓名', width: 160 },
  { key: 'email', title: '邮箱', width: 220 },
  { key: 'phone', title: '手机号', width: 160 },
  { key: 'createdAt', title: '创建时间', width: 180 },
  { key: 'updatedAt', title: '更新时间', width: 180 },
]

const rolesRequest = useRequest(rolesRegistryApi(), {
  immediate: true,
})

const rolePolicies = computed<RolePolicy[]>(() => (rolesRequest.data.value as RolePolicy[] | undefined) ?? [])
const roleNameMap = computed<Record<string, string>>(() =>
  Object.fromEntries(rolePolicies.value.map(role => [role.code, role.name])),
)
const pageLoading = computed(() => loading.value || rolesRequest.loading.value)

function handleSelectionChange(rows: SystemUser[]) {
  setSelection(rows)
}

function openCreateDialog() {
  currentUser.value = null
  formVisible.value = true
}

function openEditDialog(user: SystemUser) {
  currentUser.value = user
  formVisible.value = true
}

function openResetPasswordDialog(user: SystemUser) {
  passwordUser.value = user
  resetPasswordVisible.value = true
}

async function submitUser(payload: SystemUserPayload) {
  formSubmitting.value = true
  try {
    if (currentUser.value) {
      await updateUserApi(currentUser.value.id, payload).send()
      ElMessage.success('用户已更新')
    }
    else {
      await createUserApi(payload).send()
      ElMessage.success('用户已创建')
    }
    formVisible.value = false
    await reload()
  }
  finally {
    formSubmitting.value = false
  }
}

async function submitResetPassword(payload: { id: string; password: string }) {
  passwordSubmitting.value = true
  try {
    await resetUserPasswordApi(payload).send()
    resetPasswordVisible.value = false
    ElMessage.success('密码已重置')
  }
  finally {
    passwordSubmitting.value = false
  }
}

async function toggleUserStatus(user: SystemUser) {
  const nextStatus: SystemUserStatus = user.status === 'active' ? 'disabled' : 'active'
  const actionLabel = nextStatus === 'active' ? '启用' : '停用'

  await ElMessageBox.confirm(`确认${actionLabel}用户“${user.name}”吗？`, `${actionLabel}用户`, {
    type: 'warning',
  })

  await updateUserStatusApi(user.id, nextStatus).send()
  ElMessage.success(`用户已${actionLabel}`)
  await reload()
}

async function applyBatchStatus(status: SystemUserStatus) {
  if (!selectedIds.value.length) {
    return
  }

  const actionLabel = status === 'active' ? '启用' : '停用'
  await ElMessageBox.confirm(`确认批量${actionLabel}选中的 ${selectedIds.value.length} 个用户吗？`, `批量${actionLabel}`, {
    type: 'warning',
  })

  await batchUpdateUserStatusApi({
    ids: selectedIds.value.map(String),
    status,
  }).send()

  tableRef.value?.clearSelection()
  clearSelection()
  ElMessage.success(`已批量${actionLabel}${selectedIds.value.length} 个用户`)
  await reload()
}
</script>

<template>
  <PageContainer>
    <PageHeader title="用户管理" description="管理员可在当前页面完成查询、创建、编辑、启停用、角色分配和密码重置。">
      <template #actions>
        <PermissionButton type="primary" :permissions="['system:user:create']" @click="openCreateDialog()">
          新建用户
        </PermissionButton>
      </template>
    </PageHeader>

    <QueryPanel title="筛选条件">
      <ElForm inline>
        <ElFormItem label="关键词">
          <ElInput v-model="query.keyword" placeholder="搜索姓名、邮箱或手机号" clearable />
        </ElFormItem>
        <ElFormItem label="状态">
          <ElSelect v-model="query.status" placeholder="全部状态" clearable class="w-150px">
            <ElOption label="启用" value="active" />
            <ElOption label="停用" value="disabled" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="角色">
          <ElSelect v-model="query.roleCode" placeholder="全部角色" clearable class="w-180px">
            <ElOption v-for="role in rolePolicies" :key="role.code" :label="role.name" :value="role.code" />
          </ElSelect>
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
          <ElButton
            v-if="can(['system:user:status'])"
            type="primary"
            plain
            :disabled="!hasSelection"
            @click="applyBatchStatus('active')"
          >
            批量启用
          </ElButton>
          <ElButton
            v-if="can(['system:user:status'])"
            plain
            :disabled="!hasSelection"
            @click="applyBatchStatus('disabled')"
          >
            批量停用
          </ElButton>
        </template>
        <template #right>
          <ElTag :type="hasSelection ? 'primary' : 'info'">
            {{ hasSelection ? `已选择 ${selectedIds.length} 项` : '未选择用户' }}
          </ElTag>
        </template>
      </DataToolbar>

      <DataTable
        ref="usersTable"
        :columns="columns"
        :rows="data.list"
        :loading="pageLoading"
        selectable
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn label="角色" min-width="180">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-2">
              <ElTag v-for="roleCode in row.roleCodes" :key="roleCode" type="info">
                {{ roleNameMap[roleCode] ?? roleCode }}
              </ElTag>
            </div>
          </template>
        </ElTableColumn>

        <ElTableColumn label="状态" min-width="120">
          <template #default="{ row }">
            <UserStatusTag :status="row.status" />
          </template>
        </ElTableColumn>

        <ElTableColumn label="操作" min-width="280" fixed="right">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-2">
              <ElButton v-if="can(['system:user:edit'])" type="primary" text @click="openEditDialog(row)">
                编辑
              </ElButton>
              <ElButton v-if="can(['system:user:status'])" text @click="toggleUserStatus(row)">
                {{ row.status === 'active' ? '停用' : '启用' }}
              </ElButton>
              <ElButton
                v-if="can(['system:user:reset-password'])"
                type="warning"
                text
                @click="openResetPasswordDialog(row)"
              >
                重置密码
              </ElButton>
            </div>
          </template>
        </ElTableColumn>
      </DataTable>

      <div class="flex justify-end">
        <ElPagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          layout="total, sizes, prev, pager, next"
          :page-sizes="[10, 20, 50]"
          :total="data.total"
          @current-change="reload()"
          @size-change="reload()"
        />
      </div>
    </div>

    <UserFormDialog
      v-model="formVisible"
      :user="currentUser"
      :roles="rolePolicies"
      :submitting="formSubmitting"
      @submit="submitUser"
    />
    <ResetPasswordDialog
      v-model="resetPasswordVisible"
      :user="passwordUser"
      :submitting="passwordSubmitting"
      @submit="submitResetPassword"
    />
  </PageContainer>
</template>
