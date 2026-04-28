<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { ResetUserPasswordPayload, SystemUser } from '@/types/app'

import { isValidResetPassword } from './validators'

interface ResetPasswordForm {
  password: string
  confirmPassword: string
}

const props = defineProps<{
  modelValue: boolean
  user?: SystemUser | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: ResetUserPasswordPayload]
}>()

const formRef = ref<FormInstance>()

const model = reactive<ResetPasswordForm>({
  password: '',
  confirmPassword: '',
})

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const rules: FormRules<ResetPasswordForm> = {
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: (_rule, value: string, callback) => {
        callback(isValidResetPassword(value) ? undefined : new Error('密码至少需要 8 位'))
      },
    },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: (_rule, value: string, callback) => {
        callback(value === model.password ? undefined : new Error('两次输入的密码不一致'))
      },
    },
  ],
}

watch(
  () => props.modelValue,
  value => {
    if (!value) {
      model.password = ''
      model.confirmPassword = ''
      return
    }

    nextTick(() => formRef.value?.clearValidate())
  },
)

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid || !props.user) {
    return
  }

  emit('submit', {
    id: props.user.id,
    password: model.password.trim(),
  })
}
</script>

<template>
  <ElDialog v-model="visible" title="重置密码" width="520px" destroy-on-close>
    <div class="mb-4 text-13px text-slate-500">
      正在为 <span class="font-600 text-slate-800">{{ props.user?.name ?? '-' }}</span> 重置登录密码。
    </div>
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <ElFormItem label="新密码" prop="password">
        <ElInput v-model="model.password" type="password" show-password placeholder="请输入新密码" />
      </ElFormItem>
      <ElFormItem label="确认密码" prop="confirmPassword">
        <ElInput v-model="model.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="flex justify-end gap-3">
        <ElButton @click="visible = false">取消</ElButton>
        <ElButton type="primary" :loading="props.submitting" @click="handleSubmit()">确认重置</ElButton>
      </div>
    </template>
  </ElDialog>
</template>
