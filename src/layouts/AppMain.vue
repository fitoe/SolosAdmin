<script setup lang="ts">
const tabsStore = useTabsStore()
const route = useRoute()
const refreshKey = computed(() => {
  const routeName = String(route.name ?? route.path)
  return `${route.fullPath}:${tabsStore.getRefreshToken(routeName)}`
})
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto p-6">
    <KeepAlive :include="tabsStore.keepAliveNames">
      <div :key="refreshKey">
        <slot />
      </div>
    </KeepAlive>
  </div>
</template>
