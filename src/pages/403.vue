<script setup lang="ts">
definePage({
  meta: {
    title: '403',
    layout: 'blank',
    hidden: true,
    requiresAuth: false,
  },
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="text-64px font-800 text-slate-900">403</div>
      <div class="mt-3 text-slate-500">You do not have permission to access this page.</div>
      <ElButton class="mt-6" type="primary" @click="$router.push('/dashboard')">Back Home</ElButton>
    </div>
  </div>
</template>
