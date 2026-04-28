<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { RolePolicy, SystemUser, SystemUserPayload } from '@/types/app'

import { isValidPhone, normalizeUserPayload } from './validators'

const props = defineProps<{
  modelValue: boolean
  user?: SystemUser | null
  roles: RolePolicy[]
  submitting?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: SystemUserPayload]
}>()

const formRef = ref<FormInstance>()

const model = reactive<SystemUserPayload>({
  name: '',
  email: '',
  phone: '',
  roleCodes: [],
  status: 'active',
  remark: '',
})

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const dialogTitle = computed(() => (props.user ? '编辑用户' : '新建用户'))

const rules: FormRules<SystemUserPayload> = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      trigger: 'blur',
      validator: (_rule, value: string, callback) => {
        callback(isValidPhone(value) ? undefined : new Error('请输入正确的手机号'))
      },
    },
  ],
  roleCodes: [
    {
      trigger: 'change',
      validator: (_rule, value: string[], callback) => {
        callback(Array.isArray(value) && value.length > 0 ? undefined : new Error('请至少选择一个角色'))
      },
    },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
}

function syncModel(user?: SystemUser | null) {
  model.name = user?.name ?? ''
  model.email = user?.email ?? ''
  model.phone = user?.phone ?? ''
  model.roleCodes = [...(user?.roleCodes ?? [])]
  model.status = user?.status ?? 'active'
  model.remark = user?.remark ?? ''
}

watch(
  () => props.user,
  user => {
    syncModel(user)
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  value => {
    if (value) {
      syncModel(props.user)
      nextTick(() => formRef.value?.clearValidate())
    }
  },
)

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  emit('submit', normalizeUserPayload(model))
}
</script>

<template>
  <ElDialog v-model="visible" :title="dialogTitle" width="640px" destroy-on-close>
    <ElForm ref="formRef" :model="model" :rules="rules" label-position="top">
      <div class="grid gap-4 md:grid-cols-2">
        <ElFormItem label="姓名" prop="name">
          <ElInput v-model="model.name" placeholder="请输入姓名" />
        </ElFormItem>
        <ElFormItem label="邮箱" prop="email">
          <ElInput v-model="model.email" placeholder="请输入邮箱" />
        </ElFormItem>
        <ElFormItem label="手机号" prop="phone">
          <ElInput v-model="model.phone" placeholder="请输入手机号" />
        </ElFormItem>
        <ElFormItem label="状态" prop="status">
          <ElSelect v-model="model.status" placeholder="请选择状态">
            <ElOption label="启用" value="active" />
            <ElOption label="停用" value="disabled" />
          </ElSelect>
        </ElFormItem>
      </div>
      <ElFormItem label="角色" prop="roleCodes">
        <ElSelect v-model="model.roleCodes" placeholder="请选择角色" multiple>
          <ElOption v-for="role in props.roles" :key="role.code" :label="role.name" :value="role.code" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="备注">
        <ElInput v-model="model.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="flex justify-end gap-3">
        <ElButton @click="visible = false">取消</ElButton>
        <ElButton type="primary" :loading="props.submitting" @click="handleSubmit()">保存</ElButton>
      </div>
    </template>
  </ElDialog>
</template>
