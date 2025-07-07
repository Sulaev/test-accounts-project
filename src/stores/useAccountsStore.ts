import { defineStore } from 'pinia'

interface Label {
  text: string
}

export interface Account {
  id: string
  labels: Label[]
  type: 'Локальная' | 'LDAP'
  login: string
  password: string | null
  isValid: boolean
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount(account: Account) {
      this.accounts.push(account)
      this.saveToLocalStorage()
    },
    removeAccount(id: string) {
      this.accounts = this.accounts.filter((acc) => acc.id !== id)
      this.saveToLocalStorage()
    },
    updateAccount(id: string, updated: Partial<Account>) {
      const index = this.accounts.findIndex((acc) => acc.id === id)
      if (index !== -1) {
        this.accounts[index] = { ...this.accounts[index], ...updated }
        this.saveToLocalStorage()
      }
    },
    loadFromLocalStorage() {
      const raw = localStorage.getItem('accounts')
      if (raw) {
        try {
          this.accounts = JSON.parse(raw)
        } catch (e) {
          console.error(e)
          this.accounts = []
        }
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
    },
  },
})
