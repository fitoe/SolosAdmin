<script setup lang="ts">
import { useRequest } from '@/api/client'
import { menusRegistryApi } from '@/api/modules/system'

definePage({
  meta: {
    title: 'Menus',
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
    <PageHeader title="Menu Registry" description="Menus still come from local page routes; backend only filters and orders route keys." />
    <div class="app-card p-5">
      <DataTable
        :loading="loading"
        :columns="[
          { key: 'title', title: 'Menu' },
          { key: 'routeKey', title: 'Route Key', width: 240 },
          { key: 'path', title: 'Path', width: 220 },
          { key: 'level', title: 'Level' },
          { key: 'order', title: 'Order' },
        ]"
        :rows="data"
      >
        <ElTableColumn label="Roles" min-width="220">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-2">
              <ElTag v-for="role in row.roles" :key="role">{{ role }}</ElTag>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="Permissions" min-width="220">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-2">
              <ElTag v-for="permission in row.permissions" :key="permission" type="success">
                {{ permission }}
              </ElTag>
              <span v-if="row.permissions.length === 0" class="text-12px text-slate-400">none</span>
            </div>
          </template>
        </ElTableColumn>
      </DataTable>
    </div>
  </PageContainer>
</template>
