import { defineStore } from 'pinia'
import type { User, UserLogin, UserRegistration } from '~/types/user'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isSeller = computed(() => user.value?.userType === 'seller')
  const isCustomer = computed(() => user.value?.userType === 'customer')

  // Actions
  const login = async (credentials: UserLogin) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })

      if (response.success && response.data) {
        user.value = response.data.user
        return true
      }
      return false
    } catch (e: any) {
      error.value = e?.data?.message || 'Login failed. Please try again.'
      console.error('Login error:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: UserRegistration) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: userData,
      })

      if (response.success && response.data) {
        user.value = response.data.user
        return true
      }
      return false
    } catch (e: any) {
      error.value = e?.data?.message || 'Registration failed. Please try again.'
      console.error('Registration error:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
      })

      user.value = null
      navigateTo('/auth/login')
    } catch (e: any) {
      error.value = 'Logout failed'
      console.error('Logout error:', e)
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async () => {
    try {
      const response = await $fetch('/api/auth/me')
      if (response.success && response.data) {
        // Fetch full user data if needed
        return true
      }
      return false
    } catch (e) {
      user.value = null
      return false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    isSeller,
    isCustomer,
    // Actions
    login,
    register,
    logout,
    checkAuth,
    clearError,
  }
})
