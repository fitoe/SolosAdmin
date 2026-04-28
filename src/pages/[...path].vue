<script setup lang="ts">
definePage({
  meta: {
    title: '404',
    layout: 'blank',
    hidden: true,
    requiresAuth: false,
  },
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="text-64px font-800 text-slate-900">404</div>
      <div class="mt-3 text-slate-500">页面不存在。</div>
      <ElButton class="mt-6" type="primary" @click="$router.push('/dashboard')">返回工作台</ElButton>
    </div>
  </div>
</template>
