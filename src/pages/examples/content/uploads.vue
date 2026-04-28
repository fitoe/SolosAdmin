<script setup lang="ts">
definePage({
  meta: {
    title: '上传示例',
    icon: 'i-ep-upload',
    layout: 'admin',
    requiresAuth: true,
  },
})

const files = ref<{ name: string; size: string }[]>([])

function handleChange(uploadFile: { name: string; size?: number }) {
  files.value.push({
    name: uploadFile.name,
    size: `${Math.ceil((uploadFile.size ?? 0) / 1024)} KB`,
  })
}
</script>

<template>
  <PageContainer>
    <PageHeader title="Upload Examples" description="Single file, multi-file, and upload history examples." />
    <div class="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
      <div class="app-card p-5">
        <ElUpload drag multiple :auto-upload="false" @change="handleChange">
          <div class="i-ep-upload-filled mb-3 text-36px text-brand-600" />
          <div>Drop files here or click to select.</div>
        </ElUpload>
      </div>
      <div class="app-card p-5">
        <div class="mb-4 text-15px font-700 text-slate-800">Recent Files</div>
        <div class="flex flex-col gap-3">
          <div v-for="file in files" :key="file.name" class="rounded-3 bg-slate-50 p-3 text-14px">
            <div class="font-600 text-slate-800">{{ file.name }}</div>
            <div class="text-slate-500">{{ file.size }}</div>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>
