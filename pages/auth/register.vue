<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
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

const userTypeOptions = [
  { value: 'customer', label: 'Customer', description: 'I want to buy artisan products' },
  { value: 'seller', label: 'Artisan/Seller', description: 'I want to sell my handicrafts' },
]

const validate = (state: UserRegistration) => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Name is required' })
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.phone) errors.push({ path: 'phone', message: 'Phone is required' })
  else if (!/^\d{10}$/.test(state.phone)) errors.push({ path: 'phone', message: 'Phone must be 10 digits' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  else if (state.password.length < 6) errors.push({ path: 'password', message: 'Password must be at least 6 characters' })
  if (state.password !== confirmPassword.value) errors.push({ path: 'confirmPassword', message: 'Passwords do not match' })
  return errors
}

const onSubmit = async (event: FormSubmitEvent<UserRegistration>) => {
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.register(event.data)
    
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
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
    <div class="max-w-2xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">CraftCart</h1>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Create Your Account</h2>
        <p class="text-gray-600 dark:text-gray-400">Join our community of artisans and craft enthusiasts</p>
      </div>

      <UCard>
        <UForm :validate="validate" :state="state" @submit="onSubmit" class="space-y-4">
          <UAlert
            v-if="errorMessage"
            color="red"
            variant="soft"
            :title="errorMessage"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid' }"
            @close="errorMessage = ''"
          />

          <!-- User Type Selection -->
          <UFormGroup label="I am a" name="userType" required>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="option in userTypeOptions"
                :key="option.value"
                @click="state.userType = option.value as 'seller' | 'customer'"
                class="border-2 rounded-lg p-4 cursor-pointer transition-all"
                :class="state.userType === option.value 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'"
              >
                <div class="flex items-start">
                  <URadio
                    :model-value="state.userType"
                    :value="option.value"
                    class="mt-1"
                  />
                  <div class="ml-3">
                    <p class="font-semibold text-gray-900 dark:text-white">{{ option.label }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ option.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Full Name" name="name" required>
              <UInput
                v-model="state.name"
                placeholder="John Doe"
                size="lg"
                icon="i-heroicons-user"
              />
            </UFormGroup>

            <UFormGroup label="Phone Number" name="phone" required>
              <UInput
                v-model="state.phone"
                placeholder="9876543210"
                size="lg"
                icon="i-heroicons-phone"
                maxlength="10"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Email" name="email" required>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="your.email@example.com"
              size="lg"
              icon="i-heroicons-envelope"
            />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Password" name="password" required>
              <UInput
                v-model="state.password"
                type="password"
                placeholder="Min. 6 characters"
                size="lg"
                icon="i-heroicons-lock-closed"
              />
            </UFormGroup>

            <UFormGroup label="Confirm Password" name="confirmPassword" required>
              <UInput
                v-model="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                size="lg"
                icon="i-heroicons-lock-closed"
              />
            </UFormGroup>
          </div>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="loading"
          >
            Create Account
          </UButton>
        </UForm>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </NuxtLink>
          </p>
        </div>
      </UCard>

      <p class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        By creating an account, you agree to CraftCart's Terms of Service and Privacy Policy
      </p>
    </div>
  </div>
</template>
