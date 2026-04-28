import type { PageQueryResult } from '@/types/app'

import { useRequest } from 'alova/client'
import { alova } from '@/api/client'

interface QueryState {
  page: number
  pageSize: number
  keyword: string
}

export function usePageQuery<T>(
  createMethod: (query: QueryState) => ReturnType<typeof alova.Get<PageQueryResult<T>>>,
  initialQuery: Partial<QueryState> = {},
) {
  const query = reactive<QueryState>({
    page: 1,
    pageSize: 10,
    keyword: '',
    ...initialQuery,
  })

  const requestState = useRequest(() => createMethod(query), {
    immediate: true,
  })

  const data = computed<PageQueryResult<T>>(
    () => (requestState.data.value as PageQueryResult<T> | undefined) ?? { list: [], total: 0 },
  )

  async function reload() {
    await requestState.send()
  }

  async function reset() {
    query.page = 1
    query.keyword = ''
    await reload()
  }

  return {
    query,
    data,
    loading: requestState.loading,
    reload,
    reset,
  }
}
