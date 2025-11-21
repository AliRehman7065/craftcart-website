<script setup lang="ts">
const authStore = useAuthStore()

// Check authentication on app load
onMounted(async () => {
  await authStore.checkAuth()
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
