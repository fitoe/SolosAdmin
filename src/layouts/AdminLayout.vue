<template>
  <div class="flex min-h-screen">
    <AppSidebar />
    <div class="min-w-0 flex flex-1 flex-col">
      <AppHeader />
      <AppTabs />
      <AppMain>
        <slot />
      </AppMain>
    </div>
  </div>
</template>
