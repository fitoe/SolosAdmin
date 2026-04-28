<script setup lang="ts">
import type { SystemUserStatus } from '@/types/app'

defineProps<{
  status: SystemUserStatus
}>()
</script>

<template>
  <ElTag :type="status === 'active' ? 'success' : 'danger'">
    {{ status === 'active' ? '启用' : '停用' }}
  </ElTag>
</template>
