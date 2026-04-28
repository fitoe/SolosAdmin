<script setup lang="ts">
definePage({
  meta: {
    title: 'Form Template',
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
    <PageHeader title="Form Template" description="Single-column form page with save action.">
      <template #actions>
        <ElButton type="primary" :loading="submitting" @click="submit(async () => undefined)">Save</ElButton>
      </template>
    </PageHeader>
    <div class="app-card p-5">
      <ElForm label-position="top">
        <ElFormItem label="Title">
          <ElInput v-model="model.title" />
        </ElFormItem>
        <ElFormItem label="Category">
          <ElSelect v-model="model.category">
            <ElOption label="Default" value="default" />
            <ElOption label="Campaign" value="campaign" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="Enabled">
          <ElSwitch v-model="model.enabled" />
        </ElFormItem>
      </ElForm>
    </div>
  </PageContainer>
</template>
