export function useRouteMenu() {
  const route = useRoute()

  const activeMenu = computed(() => (route.meta.activeMenu as string | undefined) || route.path)
  const openMenus = computed(() =>
    activeMenu.value
      .split('/')
      .filter(Boolean)
      .map((_, index, parts) => `/${parts.slice(0, index + 1).join('/')}`),
  )

  return {
    activeMenu,
    openMenus,
  }
}
