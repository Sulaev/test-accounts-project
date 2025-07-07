<template>
  <n-space :wrap="false" class="w-full flex items-center">
    <n-input
      v-model:value="labelInput"
      @blur="onLabelsBlur"
      placeholder="Метки"
      :status="valid.labels ? undefined : 'error'"
      style="width: 160px"
    />

    <n-select
      v-model:value="local.type"
      :options="typeOptions"
      @update:value="onTypeChange"
      style="width: 120px"
    />

    <n-input
      v-model:value="local.login"
      @blur="onBlur"
      placeholder="Логин"
      maxlength="100"
      :status="valid.login ? undefined : 'error'"
      style="width: 180px"
    />

    <n-input
      v-if="local.type === 'Локальная'"
      v-model:value="local.password"
      type="password"
      @blur="onBlur"
      placeholder="Пароль"
      maxlength="100"
      :status="valid.password ? undefined : 'error'"
      style="width: 180px"
    />

    <n-button
      text
      ghost
      type="error"
      circle
      size="large"
      @click="$emit('delete', local.id)"
      :render-icon="() => h(Trash2)"
      style="display: flex"
    />
  </n-space>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { NInput, NSelect, NButton, NSpace } from 'naive-ui'
import type { Account } from '@/stores/useAccountsStore'
import { h } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  account: Account
}>()

const emit = defineEmits<{
  (e: 'update', id: string, data: Partial<Account>): void
  (e: 'delete', id: string): void
}>()

const local = reactive({ ...props.account })

const labelInput = ref(local.labels.map((l) => l.text).join('; '))

const valid = reactive({
  labels: true,
  login: true,
  password: true,
})

const typeOptions = [
  { label: 'Локальная', value: 'Локальная' },
  { label: 'LDAP', value: 'LDAP' },
]

function onLabelsBlur() {
  const raw = labelInput.value
  const parsed = raw
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ text }))
  valid.labels = true
  emit('update', local.id, { labels: parsed })
}

function onBlur() {
  valid.login = !!local.login.trim()
  valid.password = local.type === 'LDAP' || !!local.password?.trim()

  emit('update', local.id, {
    login: local.login,
    password: local.type === 'LDAP' ? null : local.password,
    isValid: valid.login && valid.password,
  })
}

function onTypeChange(value: string) {
  const typedValue = value as 'Локальная' | 'LDAP'
  local.type = typedValue
  onBlur()
  emit('update', local.id, { type: typedValue })
}
</script>
