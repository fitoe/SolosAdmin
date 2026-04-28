<script setup lang="ts">
definePage({
  meta: {
    title: '详情模板',
    icon: 'i-ep-document-checked',
    layout: 'admin',
    requiresAuth: true,
  },
})
</script>

<template>
  <PageContainer>
    <PageHeader title="详情模板" description="只读型的分组明细信息展示页面。" />
    <DetailSection title="基础信息">
      <ElDescriptions :column="2" border>
        <ElDescriptionsItem label="ID">T-1024</ElDescriptionsItem>
        <ElDescriptionsItem label="状态">已发布</ElDescriptionsItem>
        <ElDescriptionsItem label="负责人">管理员</ElDescriptionsItem>
        <ElDescriptionsItem label="更新时间">2026-04-27 16:08</ElDescriptionsItem>
      </ElDescriptions>
    </DetailSection>
  </PageContainer>
</template>
