<script setup lang="ts">
import { dashboardSummaryApi } from '@/api/modules/dashboard'
import { useRequest } from '@/api/client'

definePage({
  meta: {
    title: 'Dashboard',
    icon: 'i-ep-data-analysis',
    layout: 'admin',
    requiresAuth: true,
    keepAlive: true,
    affix: true,
  },
})

const { data, loading } = useRequest(dashboardSummaryApi(), {
  immediate: true,
})

const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['Visits', 'Orders'] },
  xAxis: { type: 'category', data: data.value?.trend.map(item => item[0]) ?? [] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Visits', type: 'line', smooth: true, data: data.value?.trend.map(item => item[1]) ?? [] },
    { name: 'Orders', type: 'bar', data: data.value?.trend.map(item => item[2]) ?? [] },
  ],
}))

const channelOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['42%', '70%'],
      data: data.value?.channels ?? [],
    },
  ],
}))
</script>

<template>
  <PageContainer>
    <PageHeader title="Dashboard" description="Admin home with cards, trend chart, and traffic mix.">
      <template #actions>
        <ElTag type="primary">Route meta + tabs + keepAlive</ElTag>
      </template>
    </PageHeader>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div v-for="card in data?.cards ?? []" :key="card.label" class="app-card p-5">
        <div class="text-13px text-slate-500">{{ card.label }}</div>
        <div class="mt-3 text-30px font-700 text-slate-900">{{ card.value }}</div>
        <div class="mt-2 text-13px text-emerald-600">{{ card.delta }}</div>
      </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
      <ChartContainer title="Weekly Trend" :option="trendOption" />
      <ChartContainer title="Traffic Mix" :option="channelOption" />
    </div>

    <DetailSection title="What this template ships with">
      <ElSkeleton :loading="loading" animated>
        <template #template>
          <ElSkeletonItem variant="p" class="mb-3" />
          <ElSkeletonItem variant="p" class="mb-3" />
          <ElSkeletonItem variant="p" />
        </template>
        <ul class="m-0 flex list-none flex-col gap-3 p-0 text-14px text-slate-600">
          <li>Page-driven route meta and route-derived menu, breadcrumb, tabs.</li>
          <li>Pinia stores for app, user, permission, and tabs.</li>
          <li>alova request layer, charts, markdown, uploads, Excel examples.</li>
        </ul>
      </ElSkeleton>
    </DetailSection>
  </PageContainer>
</template>
