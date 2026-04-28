<script setup lang="ts">
import { useRequest } from '@/api/client'
import { rolesRegistryApi } from '@/api/modules/system'

definePage({
  meta: {
    title: '角色管理',
    icon: 'i-ep-key',
    layout: 'admin',
    requiresAuth: true,
    roles: ['admin'],
  },
})

const { data = shallowRef([]), loading } = useRequest(rolesRegistryApi(), {
  immediate: true,
})
</script>

<template>
  <PageContainer>
    <PageHeader title="Role Management" description="Backend route-key mapping shown per role." />
    <div class="grid gap-4 xl:grid-cols-2">
      <div v-for="role in data" :key="role.code" class="app-card p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="text-16px font-700 text-slate-900">{{ role.name }}</div>
            <div class="mt-1 text-13px text-slate-500">{{ role.description }}</div>
          </div>
          <ElTag>{{ role.members }} members</ElTag>
        </div>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <div class="mb-2 text-13px font-600 text-slate-700">Route Keys</div>
            <div class="flex flex-wrap gap-2">
              <ElTag v-for="routeKey in role.routeKeys" :key="routeKey" type="info">{{ routeKey }}</ElTag>
            </div>
          </div>
          <div>
            <div class="mb-2 text-13px font-600 text-slate-700">Permissions</div>
            <div class="flex flex-wrap gap-2">
              <ElTag v-for="permission in role.permissionKeys" :key="permission" type="success">
                {{ permission }}
              </ElTag>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ElSkeleton v-if="loading" animated />
    <div v-if="!loading" class="app-card p-5 text-13px text-slate-500">
      登录时先拿用户角色，再拉取后端授权 route keys，最后映射到本地页面路由树。
    </div>
  </PageContainer>
</template>
