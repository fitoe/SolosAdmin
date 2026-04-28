<script setup lang="ts">
import { useRequest } from '@/api/client'
import { menusRegistryApi } from '@/api/modules/system'

definePage({
  meta: {
    title: '菜单配置',
    icon: 'i-ep-menu',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin'],
  },
})

const { data = shallowRef([]), loading } = useRequest(menusRegistryApi(), {
  immediate: true,
})
</script>

<template>
  <PageContainer>
    <PageHeader title="菜单配置" description="菜单仍来源于本地页面路由，后端只负责过滤与排序路由键。" />
    <div class="app-card p-5">
      <DataTable
        :loading="loading"
        :columns="[
          { key: 'title', title: '菜单名称' },
          { key: 'routeKey', title: '路由标识', width: 240 },
          { key: 'path', title: '路径', width: 220 },
          { key: 'level', title: '层级' },
          { key: 'order', title: '排序' },
        ]"
        :rows="data"
      >
        <ElTableColumn label="角色" min-width="220">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-2">
              <ElTag v-for="role in row.roles" :key="role">{{ role }}</ElTag>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="权限" min-width="220">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-2">
              <ElTag v-for="permission in row.permissions" :key="permission" type="success">
                {{ permission }}
              </ElTag>
              <span v-if="row.permissions.length === 0" class="text-12px text-slate-400">无</span>
            </div>
          </template>
        </ElTableColumn>
      </DataTable>
    </div>
  </PageContainer>
</template>
