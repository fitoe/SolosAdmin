<script setup lang="ts">
definePage({
  meta: {
    title: 'Detail Template',
    icon: 'i-ep-document-checked',
    layout: 'admin',
    requiresAuth: true,
  },
})
</script>

<template>
  <PageContainer>
    <PageHeader title="Detail Template" description="Read-only grouped detail blocks." />
    <DetailSection title="Base Information">
      <ElDescriptions :column="2" border>
        <ElDescriptionsItem label="ID">T-1024</ElDescriptionsItem>
        <ElDescriptionsItem label="Status">Published</ElDescriptionsItem>
        <ElDescriptionsItem label="Owner">Admin User</ElDescriptionsItem>
        <ElDescriptionsItem label="Updated">2026-04-27 16:08</ElDescriptionsItem>
      </ElDescriptions>
    </DetailSection>
  </PageContainer>
</template>
