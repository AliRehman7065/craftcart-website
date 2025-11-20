<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const navigationItems = [
  { label: 'Home', to: '/', icon: 'i-heroicons-home' },
  { label: 'Products', to: '/products', icon: 'i-heroicons-shopping-bag' },
  { label: 'About', to: '/about', icon: 'i-heroicons-information-circle' },
]

const userMenuItems = computed(() => {
  if (!authStore.isAuthenticated) return []
  
  const items = [
    {
      label: authStore.isSeller ? 'Seller Dashboard' : 'My Orders',
      to: authStore.isSeller ? '/seller/dashboard' : '/customer/orders',
      icon: 'i-heroicons-squares-2x2',
    },
    {
      label: 'Profile',
      to: '/profile',
      icon: 'i-heroicons-user',
    },
  ]

  return items
})

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">CraftCart</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-6">
            <NuxtLink
              v-for="item in navigationItems"
              :key="item.to"
              :to="item.to"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <UButton
                v-if="authStore.isSeller"
                to="/products/create"
                color="primary"
                variant="soft"
                icon="i-heroicons-plus"
                class="hidden md:flex"
              >
                Add Product
              </UButton>

              <UDropdown :items="[userMenuItems, [{ label: 'Logout', icon: 'i-heroicons-arrow-right-on-rectangle', click: handleLogout }]]">
                <UAvatar
                  :alt="authStore.user?.name"
                  :src="authStore.user?.profileImage"
                  size="sm"
                  class="cursor-pointer"
                />
              </UDropdown>
            </template>
            <template v-else>
              <UButton to="/auth/login" variant="ghost" color="gray">
                Sign In
              </UButton>
              <UButton to="/auth/register" color="primary">
                Sign Up
              </UButton>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-bold text-primary-600 dark:text-primary-400 mb-4">CraftCart</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Connecting artisans with customers across India. Supporting traditional craftsmanship and economic growth.
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/about" class="text-gray-600 dark:text-gray-400 hover:text-primary-600">About Us</NuxtLink></li>
              <li><NuxtLink to="/products" class="text-gray-600 dark:text-gray-400 hover:text-primary-600">Products</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-600 dark:text-gray-400 hover:text-primary-600">Contact</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">For Sellers</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/auth/register" class="text-gray-600 dark:text-gray-400 hover:text-primary-600">Become a Seller</NuxtLink></li>
              <li><NuxtLink to="/seller/help" class="text-gray-600 dark:text-gray-400 hover:text-primary-600">Seller Help</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/faq" class="text-gray-600 dark:text-gray-400 hover:text-primary-600">FAQ</NuxtLink></li>
              <li><NuxtLink to="/terms" class="text-gray-600 dark:text-gray-400 hover:text-primary-600">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-gray-600 dark:text-gray-400 hover:text-primary-600">Privacy Policy</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 CraftCart. All rights reserved. Supporting SDG 8 - Decent Work and Economic Growth</p>
        </div>
      </div>
    </footer>
  </div>
</template>
