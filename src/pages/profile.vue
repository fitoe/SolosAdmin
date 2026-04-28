<script setup lang="ts">
definePage({
  meta: {
    title: 'Profile',
    icon: 'i-ep-user-filled',
    layout: 'admin',
    requiresAuth: true,
    hidden: true,
    activeMenu: '/dashboard',
  },
})

const userStore = useUserStore()
</script>

<template>
  <PageContainer>
    <PageHeader title="Profile" description="Simple personal center page." />
    <DetailSection title="User Profile">
      <ElDescriptions :column="2" border>
        <ElDescriptionsItem label="Name">{{ userStore.profile?.name }}</ElDescriptionsItem>
        <ElDescriptionsItem label="Role">{{ userStore.profile?.role }}</ElDescriptionsItem>
        <ElDescriptionsItem label="Roles">{{ userStore.profile?.roles.join(', ') }}</ElDescriptionsItem>
        <ElDescriptionsItem label="Permissions">{{ userStore.profile?.permissions.join(', ') }}</ElDescriptionsItem>
      </ElDescriptions>
    </DetailSection>
  </PageContainer>
</template>
