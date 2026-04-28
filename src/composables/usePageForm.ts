import { ElMessage } from 'element-plus'

export function usePageForm<T extends object>(initialValue: T) {
  const model = reactive(structuredClone(initialValue))
  const submitting = ref(false)

  async function submit(handler: (payload: T) => Promise<void>) {
    submitting.value = true
    try {
      await handler(toRaw(model) as T)
      ElMessage.success('Saved')
    } finally {
      submitting.value = false
    }
  }

  return {
    model,
    submitting,
    submit,
  }
}
