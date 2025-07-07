<template>
  <div class="min-h-screen w-full overflow-x-hidden flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-4xl p-6 rounded shadow bg-white flex flex-col items-center gap-5">
      <n-space justify="center" align="center" class="w-full mb-4">
        <h1 class="text-2xl font-bold text-black">Учетные записи</h1>
        <n-button
          type="primary"
          @click="addAccount"
          :render-icon="() => h(Plus)"
          size="small"
          style="width: 32px; height: 32px; border-radius: 4px"
        />
      </n-space>

      <n-alert title="Подсказка" type="info" class="mb-4 w-full max-w-2xl">
        Для указания нескольких меток для одной пары логин/пароль используйте разделитель <b>;</b>
      </n-alert>

      <div class="flex flex-col h-full items-center gap-5">
        <div
          class="grid grid-cols-[160px_125px_185px_180px] gap-2 text-xs text-gray-500 font-medium w-full px-1"
        >
          <div>Метки</div>
          <div>Тип записи</div>
          <div>Логин</div>
          <div>Пароль</div>
        </div>

        <AccountRow
          v-for="account in store.accounts"
          :key="account.id"
          :account="account"
          @update="onUpdate"
          @delete="onDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useAccountsStore } from './stores/useAccountsStore'
import AccountRow from './components/AccountRow.vue'
import { NButton, NSpace, NAlert } from 'naive-ui'
import { h } from 'vue'
import { Plus } from 'lucide-vue-next'

const store = useAccountsStore()

onMounted(() => {
  store.loadFromLocalStorage()
})

function addAccount() {
  store.addAccount({
    id: uuidv4(),
    labels: [],
    type: 'Локальная',
    login: '',
    password: '',
    isValid: false,
  })
}

function onUpdate(id: string, data: any) {
  store.updateAccount(id, data)
  store.saveToLocalStorage()
}

function onDelete(id: string) {
  store.removeAccount(id)
  store.saveToLocalStorage()
}
</script>
