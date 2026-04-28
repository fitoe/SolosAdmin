<script setup lang="ts">
definePage({
  meta: {
    title: '表单模板',
    icon: 'i-ep-edit-pen',
    layout: 'admin',
    requiresAuth: true,
  },
})

const { model, submitting, submit } = usePageForm({
  title: '',
  category: 'default',
  enabled: true,
})
</script>

<template>
  <PageContainer>
    <PageHeader title="表单模板" description="单列布局的基础表单页面，带保存动作。" >
      <template #actions>
        <ElButton type="primary" :loading="submitting" @click="submit(async () => undefined)">保存</ElButton>
      </template>
    </PageHeader>
    <div class="app-card p-5">
      <ElForm label-position="top">
        <ElFormItem label="标题">
          <ElInput v-model="model.title" />
        </ElFormItem>
        <ElFormItem label="分类">
          <ElSelect v-model="model.category">
            <ElOption label="默认" value="default" />
            <ElOption label="活动" value="campaign" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="启用">
          <ElSwitch v-model="model.enabled" />
        </ElFormItem>
      </ElForm>
    </div>
  </PageContainer>
</template>
