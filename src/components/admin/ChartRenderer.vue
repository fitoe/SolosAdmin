<script setup lang="ts">
import { use } from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([BarChart, LineChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

defineProps<{
  option: Record<string, unknown>
  height?: string
}>()
</script>

<template>
  <VChart autoresize :option="option" :style="{ height: height ?? '320px' }" />
</template>
