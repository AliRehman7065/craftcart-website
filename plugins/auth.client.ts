let authCheckInProgress = false

export default defineNuxtPlugin({
  name: 'auth-init',
  dependsOn: ['pinia'],
  async setup(nuxtApp) {
    // Prevent multiple concurrent auth checks
    if (authCheckInProgress) {
      console.log('Auth check already in progress, skipping')
      return
    }
    
    authCheckInProgress = true
    const authStore = useAuthStore(nuxtApp.$pinia as any)
    
    // Check authentication on app initialization
    try {
      await authStore.checkAuth()
      console.log('Auth check completed, authenticated:', authStore.isAuthenticated)
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      authCheckInProgress = false
    }
  }
})
