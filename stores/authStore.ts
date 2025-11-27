import { defineStore } from 'pinia'
import type { User, UserLogin, UserRegistration } from '~/types/user'
import type { ApiResponse } from '~/types/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isSeller = computed(() => user.value?.userType === 'seller')
  const isCustomer = computed(() => user.value?.userType === 'customer')

  // Actions
  const login = async (credentials: UserLogin): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<{ user: User; token: string }>>('/api/auth/login', {
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

  const register = async (userData: UserRegistration): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<{ user: User; token: string }>>('/api/auth/register', {
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

  const logout = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await $fetch<ApiResponse<null>>('/api/auth/logout', {
        method: 'POST',
      })

      user.value = null
      await navigateTo('/auth/login')
    } catch (e: any) {
      error.value = 'Logout failed'
      console.error('Logout error:', e)
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async (retryCount = 0): Promise<boolean> => {
    try {
      const response = await $fetch<ApiResponse<{ user: User }>>('/api/auth/me', {
        credentials: 'include',
        retry: 2,
        retryDelay: 500,
      })
      if (response.success && response.data) {
        user.value = response.data.user
        return true
      }
      return false
    } catch (e: any) {
      // Retry once on network errors but not on 401
      if (retryCount === 0 && e?.statusCode !== 401) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return checkAuth(retryCount + 1)
      }
      console.log('Auth check failed:', e)
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
