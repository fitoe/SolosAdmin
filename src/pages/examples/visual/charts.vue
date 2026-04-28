<script setup lang="ts">
definePage({
  meta: {
    title: '图表示例',
    icon: 'i-ep-pie-chart',
    layout: 'admin',
    requiresAuth: true,
    keepAlive: true,
  },
})

const barOption = {
  tooltip: {},
  xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150, 80] }],
}
</script>

<template>
  <PageContainer>
    <PageHeader title="Charts Example" description="Reusable chart container with ECharts." />
    <ChartContainer title="Quarter Revenue" :option="barOption" />
  </PageContainer>
</template>
