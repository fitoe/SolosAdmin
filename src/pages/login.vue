<script setup lang="ts">
definePage({
  meta: {
    title: 'Login',
    layout: 'blank',
    hidden: true,
    requiresAuth: false,
  },
})

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const role = ref<'admin' | 'editor'>('admin')

async function submit() {
  loading.value = true
  try {
    await userStore.login(role.value)
    await router.push(String(route.query.redirect ?? '/dashboard'))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section class="hidden rounded-6 bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div class="mb-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-12px">
            Universal Admin Template
          </div>
          <h1 class="max-w-lg text-42px font-700 leading-tight">
            Route-driven admin shell with typed pages, permissions, charts, and editors.
          </h1>
        </div>
        <div class="grid grid-cols-2 gap-4 text-13px text-slate-300">
          <div class="rounded-4 bg-white/8 p-4">Vue 3 + Vite + Element Plus + UnoCSS</div>
          <div class="rounded-4 bg-white/8 p-4">Auto imports, infinite menu, page meta auth</div>
        </div>
      </section>
      <section class="rounded-6 border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <div class="mb-8">
          <div class="text-28px font-700 text-slate-900">Sign in</div>
          <div class="mt-2 text-14px text-slate-500">Choose a role to preview permission differences.</div>
        </div>
        <ElForm label-position="top">
          <ElFormItem label="Preview Role">
            <ElRadioGroup v-model="role">
              <ElRadioButton value="admin">Admin</ElRadioButton>
              <ElRadioButton value="editor">Editor</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
          <ElFormItem label="Email">
            <ElInput model-value="demo@solos.dev" readonly />
          </ElFormItem>
          <ElFormItem label="Password">
            <ElInput model-value="••••••••" readonly show-password />
          </ElFormItem>
          <ElButton type="primary" class="w-full" size="large" :loading="loading" @click="submit">
            Enter Admin
          </ElButton>
        </ElForm>
      </section>
    </div>
  </div>
</template>
