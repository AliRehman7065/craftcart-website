export default defineNuxtPlugin({
  name: 'auth-init',
  dependsOn: ['pinia'],
  async setup(nuxtApp) {
    const authStore = useAuthStore(nuxtApp.$pinia as any)
    
    // Check authentication on app initialization
    try {
      await authStore.checkAuth()
      console.log('Auth check completed, authenticated:', authStore.isAuthenticated)
    } catch (error) {
      console.error('Auth initialization error:', error)
    }
  }
})
