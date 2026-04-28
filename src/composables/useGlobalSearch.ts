import type { MenuItem } from '@/router/menu'

export function useGlobalSearch() {
  const permissionStore = usePermissionStore()
  const router = useRouter()
  const keyword = ref('')
  const visible = ref(false)

  const results = computed(() =>
    permissionStore.flatMenuItems.filter(
      (item: MenuItem) =>
        item.children == null && item.title.toLowerCase().includes(keyword.value.toLowerCase()),
    ),
  )

  function open() {
    visible.value = true
  }

  function close() {
    visible.value = false
    keyword.value = ''
  }

  async function go(path: string) {
    await router.push(path)
    close()
  }

  return {
    keyword,
    results,
    visible,
    open,
    close,
    go,
  }
}
