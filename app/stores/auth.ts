import { defineStore } from 'pinia'

/** Credenciales visibles a propósito: es un entorno de demostración, no hay datos reales que proteger. */
export const DEMO_CREDENTIALS = { user: 'demo', password: 'demo123' } as const

export const useAuthStore = defineStore('auth', {
  state: () => ({ loggedIn: false }),
  actions: {
    login(user: string, password: string): boolean {
      this.loggedIn = user.trim().toLowerCase() === DEMO_CREDENTIALS.user && password === DEMO_CREDENTIALS.password
      return this.loggedIn
    },
    logout() {
      this.loggedIn = false
    },
  },
  persist: { key: 'inv-auth' },
})
