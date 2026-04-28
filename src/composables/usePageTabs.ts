export function usePageTabs() {
  const route = useRoute()
  const tabsStore = useTabsStore()

  function syncCurrentRoute() {
    if (route.meta.layout === 'blank' || route.meta.hidden) {
      return
    }

    tabsStore.openTab({
      fullPath: route.fullPath,
      path: route.path,
      name: String(route.name ?? route.path),
      title: route.meta.title ?? String(route.name ?? route.path),
      affix: Boolean(route.meta.affix),
      keepAlive: Boolean(route.meta.keepAlive),
    })
  }

  return {
    syncCurrentRoute,
  }
}
