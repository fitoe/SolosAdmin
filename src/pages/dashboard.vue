<script setup lang="ts">
import { dashboardSummaryApi } from '@/api/modules/dashboard'
import { useRequest } from '@/api/client'

definePage({
  meta: {
    title: '工作台',
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
  legend: { data: ['访问量', '订单量'] },
  xAxis: { type: 'category', data: data.value?.trend.map(item => item[0]) ?? [] },
  yAxis: { type: 'value' },
  series: [
    { name: '访问量', type: 'line', smooth: true, data: data.value?.trend.map(item => item[1]) ?? [] },
    { name: '订单量', type: 'bar', data: data.value?.trend.map(item => item[2]) ?? [] },
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
    <PageHeader title="工作台" description="后台首页，展示核心指标、趋势图和流量结构。">
      <template #actions>
        <ElTag type="primary">路由元信息 + 标签页 + KeepAlive</ElTag>
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
      <ChartContainer title="周趋势" :option="trendOption" />
      <ChartContainer title="流量结构" :option="channelOption" />
    </div>

    <DetailSection title="当前模板包含">
      <ElSkeleton :loading="loading" animated>
        <template #template>
          <ElSkeletonItem variant="p" class="mb-3" />
          <ElSkeletonItem variant="p" class="mb-3" />
          <ElSkeletonItem variant="p" />
        </template>
        <ul class="m-0 flex list-none flex-col gap-3 p-0 text-14px text-slate-600">
          <li>基于页面驱动的路由元信息、菜单、面包屑和标签页。</li>
          <li>内置 app、user、permission、tabs 等 Pinia 状态管理。</li>
          <li>包含 alova 请求层、图表、Markdown、上传和 Excel 示例。</li>
        </ul>
      </ElSkeleton>
    </DetailSection>
  </PageContainer>
</template>
