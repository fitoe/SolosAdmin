import type { PageQueryResult, SystemUserQuery } from '@/types/app'

import { useRequest } from 'alova/client'
import { alova } from '@/api/client'

export function usePageQuery<T>(
  createMethod: (query: SystemUserQuery) => ReturnType<typeof alova.Get<PageQueryResult<T>>>,
  initialQuery: Partial<SystemUserQuery> = {},
) {
  const query = reactive<SystemUserQuery>({
    page: 1,
    pageSize: 10,
    keyword: '',
    status: '',
    roleCode: '',
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
    query.status = ''
    query.roleCode = ''
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
