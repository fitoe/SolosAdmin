<script setup lang="ts">
const props = defineProps<{
  permissions?: string[]
  type?: 'primary' | 'default' | 'success' | 'warning' | 'danger'
  plain?: boolean
}>()

const { can } = usePermission()
const visible = computed(() => can(props.permissions))
</script>

<template>
  <ElButton v-if="visible" :type="type" :plain="plain">
    <slot />
  </ElButton>
</template>
