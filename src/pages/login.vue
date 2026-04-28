<script setup lang="ts">
definePage({
  meta: {
    title: '登录',
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
            通用后台模板
          </div>
          <h1 class="max-w-lg text-42px font-700 leading-tight">
            基于路由驱动的后台壳层，内置权限、图表、编辑器与页面模板。
          </h1>
        </div>
        <div class="grid grid-cols-2 gap-4 text-13px text-slate-300">
          <div class="rounded-4 bg-white/8 p-4">Vue 3 + Vite + Element Plus + UnoCSS</div>
          <div class="rounded-4 bg-white/8 p-4">自动导入、无限级菜单、页面级权限控制</div>
        </div>
      </section>
      <section class="rounded-6 border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <div class="mb-8">
          <div class="text-28px font-700 text-slate-900">登录系统</div>
          <div class="mt-2 text-14px text-slate-500">选择角色，预览不同权限下的后台视图。</div>
        </div>
        <ElForm label-position="top">
          <ElFormItem label="预览角色">
            <ElRadioGroup v-model="role">
              <ElRadioButton value="admin">管理员</ElRadioButton>
              <ElRadioButton value="editor">编辑员</ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
          <ElFormItem label="邮箱">
            <ElInput model-value="demo@solos.dev" readonly />
          </ElFormItem>
          <ElFormItem label="密码">
            <ElInput model-value="••••••••" readonly show-password />
          </ElFormItem>
          <ElButton type="primary" class="w-full" size="large" :loading="loading" @click="submit">
            进入后台
          </ElButton>
        </ElForm>
      </section>
    </div>
  </div>
</template>
