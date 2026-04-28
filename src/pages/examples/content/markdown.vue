<script setup lang="ts">
definePage({
  meta: {
    title: 'Markdown Editor',
    icon: 'i-ep-edit',
    layout: 'admin',
    requiresAuth: true,
    keepAlive: true,
  },
})

const markdown = ref(`# Solos Admin\n\n- Route driven\n- UnoCSS + Iconify\n- Element Plus\n`)
</script>

<template>
  <PageContainer>
    <PageHeader title="Markdown Editor" description="MdEditorV3 editor and preview example." />
    <div class="grid gap-4 xl:grid-cols-2">
      <div class="app-card p-5">
        <MarkdownEditorField v-model="markdown" />
      </div>
      <div class="app-card p-5">
        <MarkdownEditorField :model-value="markdown" preview-only />
      </div>
    </div>
  </PageContainer>
</template>
