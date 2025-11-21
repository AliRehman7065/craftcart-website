<script setup lang="ts">
import type { UserRegistration } from '~/types/user'

definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const router = useRouter()

const state = reactive<UserRegistration>({
  name: '',
  email: '',
  phone: '',
  password: '',
  userType: 'customer',
})

const loading = ref(false)
const errorMessage = ref('')
const confirmPassword = ref('')

const onSubmit = async () => {
  // Validation
  if (!state.name || !state.email || !state.phone || !state.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }
  
  if (!/^\d{10}$/.test(state.phone)) {
    errorMessage.value = 'Phone must be 10 digits'
    return
  }
  
  if (state.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }
  
  if (state.password !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.register(state)
    
    // Redirect based on user type
    if (authStore.isSeller) {
      router.push('/seller/dashboard')
    } else {
      router.push('/')
    }
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Registration failed. Please try again.'
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
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Create Account</h2>
        <p class="text-gray-600 dark:text-gray-400">Join our artisan marketplace today</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- User Type Selection -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">I want to:</label>
            <div class="space-y-2">
              <label class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all" :class="state.userType === 'customer' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'">
                <input type="radio" v-model="state.userType" value="customer" class="mt-1 text-orange-600 focus:ring-orange-500" />
                <div class="ml-3">
                  <div class="font-medium text-gray-900 dark:text-white">Customer</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">I want to buy artisan products</div>
                </div>
              </label>
              
              <label class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all" :class="state.userType === 'seller' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'">
                <input type="radio" v-model="state.userType" value="seller" class="mt-1 text-orange-600 focus:ring-orange-500" />
                <div class="ml-3">
                  <div class="font-medium text-gray-900 dark:text-white">Artisan/Seller</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">I want to sell my handicrafts</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input 
              id="name"
              v-model="state.name" 
              type="text" 
              required
              placeholder="John Doe"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input 
              id="phone"
              v-model="state.phone" 
              type="tel" 
              required
              placeholder="9876543210"
              maxlength="10"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
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
              minlength="6"
              placeholder="Min. 6 characters"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Re-enter password</label>
            <input 
              id="confirmPassword"
              v-model="confirmPassword" 
              type="password" 
              required
              placeholder="Re-enter password"
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
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </AppButton>

          <!-- Sign In Link -->
          <div class="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account? 
            <NuxtLink to="/auth/login" class="text-orange-600 hover:text-orange-700 font-medium">
              Sign in
            </NuxtLink>
          </div>

          <!-- Terms -->
          <div class="text-xs text-center text-gray-500 dark:text-gray-500">
            By creating an account, you agree to CraftCart's Terms of Service and Privacy Policy
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
