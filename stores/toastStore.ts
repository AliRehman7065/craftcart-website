import { defineStore } from 'pinia'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
  }),

  actions: {
    show(message: string, type: Toast['type'] = 'info', duration: number = 3000) {
      const id = Math.random().toString(36).substring(7)
      const toast: Toast = { id, message, type, duration }
      
      this.toasts.push(toast)
      
      if (duration > 0) {
        setTimeout(() => {
          this.remove(id)
        }, duration)
      }
    },

    success(message: string, duration?: number) {
      this.show(message, 'success', duration)
    },

    error(message: string, duration?: number) {
      this.show(message, 'error', duration || 5000)
    },

    warning(message: string, duration?: number) {
      this.show(message, 'warning', duration)
    },

    info(message: string, duration?: number) {
      this.show(message, 'info', duration)
    },

    remove(id: string) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },
  },
})
