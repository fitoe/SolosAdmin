import { alova } from '@/api/client'

export interface DashboardCard {
  label: string
  value: string
  delta: string
}

export interface DashboardSummary {
  cards: DashboardCard[]
  trend: [string, number, number][]
  channels: Array<{ name: string; value: number }>
}

export function dashboardSummaryApi() {
  return alova.Get<DashboardSummary>('/dashboard/summary')
}
