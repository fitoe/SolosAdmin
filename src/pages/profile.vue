<script setup lang="ts">
definePage({
  meta: {
    title: '个人中心',
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
    <PageHeader title="个人中心" description="查看当前账号的角色与权限信息。" />
    <DetailSection title="用户资料">
      <ElDescriptions :column="2" border>
        <ElDescriptionsItem label="姓名">{{ userStore.profile?.name }}</ElDescriptionsItem>
        <ElDescriptionsItem label="角色">{{ userStore.profile?.role }}</ElDescriptionsItem>
        <ElDescriptionsItem label="角色组">{{ userStore.profile?.roles.join(', ') }}</ElDescriptionsItem>
        <ElDescriptionsItem label="权限">{{ userStore.profile?.permissions.join(', ') }}</ElDescriptionsItem>
      </ElDescriptions>
    </DetailSection>
  </PageContainer>
</template>
