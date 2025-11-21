<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="close"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
          <AppButton
            color="indigo"
            @click="navigateToSignUp"
            class="w-full sm:w-auto"
          >
            Sign Up
          </AppButton>
          <AppButton
            variant="outline"
            color="indigo"
            @click="navigateToSignIn"
            class="w-full sm:w-auto mt-3 sm:mt-0"
          >
            Sign In
          </AppButton>
          <AppButton
            variant="ghost"
            color="gray"
            @click="close"
            class="w-full sm:w-auto mt-3 sm:mt-0"
          >
            Cancel
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Authentication Required',
  },
  message: {
    type: String,
    default: 'Please sign in or create an account to continue.',
  },
})

const emit = defineEmits(['close', 'sign-in', 'sign-up'])

const router = useRouter()

const close = () => {
  emit('close')
}

const navigateToSignIn = () => {
  emit('sign-in')
  router.push('/auth/login')
  close()
}

const navigateToSignUp = () => {
  emit('sign-up')
  router.push('/auth/signup')
  close()
}

// Close modal on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      close()
    }
  }
  window.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape)
  })
})
</script>
