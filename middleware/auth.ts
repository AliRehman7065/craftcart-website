export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  
  // On client side, check authentication status from server
  if (import.meta.client) {
    // Check authentication status from server if not already authenticated
    if (!authStore.isAuthenticated) {
      await authStore.checkAuth()
    }
    
    // If still not authenticated after check, redirect to login
    if (!authStore.isAuthenticated) {
      return navigateTo('/auth/login')
    }
  }
})
