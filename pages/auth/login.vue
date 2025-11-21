<script setup lang="ts">
import type { UserLogin } from '~/types/user'

definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const router = useRouter()

const state = reactive<UserLogin>({
  email: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

const onSubmit = async () => {
  if (!state.email || !state.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(state)
    
    // Redirect based on user type
    if (authStore.isSeller) {
      router.push('/seller/dashboard')
    } else {
      router.push('/')
    }
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
    <div class="max-w-md w-full">
      <!-- Back to Home Button -->
      <div class="mb-6">
        <AppButton
          variant="ghost"
          to="/"
          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          ← Back to Home
        </AppButton>
      </div>

      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">CraftCart</h1>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
        <p class="text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input 
              id="email"
              v-model="state.email" 
              type="email" 
              required
              placeholder="your.email@example.com"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input 
              id="password"
              v-model="state.password" 
              type="password" 
              required
              placeholder="Enter your password"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Submit Button -->
          <AppButton 
            type="submit" 
            color="primary"
            size="lg"
            :disabled="loading"
            class="w-full"
          >
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </AppButton>

          <!-- Sign Up Link -->
          <div class="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? 
            <NuxtLink to="/auth/register" class="text-orange-600 hover:text-orange-700 font-medium">
              Sign up
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
