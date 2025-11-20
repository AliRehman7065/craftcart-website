<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
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

const validate = (state: UserLogin) => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

const onSubmit = async (event: FormSubmitEvent<UserLogin>) => {
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(event.data)
    
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
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">CraftCart</h1>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
        <p class="text-gray-600 dark:text-gray-400">Sign in to your account</p>
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

          <UFormGroup label="Email" name="email" required>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="your.email@example.com"
              size="lg"
              icon="i-heroicons-envelope"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password" required>
            <UInput
              v-model="state.password"
              type="password"
              placeholder="Enter your password"
              size="lg"
              icon="i-heroicons-lock-closed"
            />
          </UFormGroup>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="loading"
          >
            Sign In
          </UButton>
        </UForm>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <NuxtLink to="/auth/register" class="text-primary-600 hover:text-primary-500 font-medium">
              Sign up
            </NuxtLink>
          </p>
        </div>
      </UCard>

      <p class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        By continuing, you agree to CraftCart's Terms of Service and Privacy Policy
      </p>
    </div>
  </div>
</template>
