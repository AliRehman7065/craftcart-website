<script setup lang="ts">
const categories = [
  { name: 'Handicrafts', icon: 'i-heroicons-sparkles', color: 'orange' },
  { name: 'Textiles', icon: 'i-heroicons-swatch', color: 'purple' },
  { name: 'Pottery', icon: 'i-heroicons-beaker', color: 'amber' },
  { name: 'Jewelry', icon: 'i-heroicons-gif', color: 'yellow' },
  { name: 'Home Decor', icon: 'i-heroicons-home', color: 'green' },
  { name: 'Paintings', icon: 'i-heroicons-paint-brush', color: 'blue' },
  { name: 'Woodwork', icon: 'i-heroicons-cube', color: 'brown' },
  { name: 'Metalwork', icon: 'i-heroicons-wrench-screwdriver', color: 'gray' },
]

const features = [
  {
    title: 'Authentic Craftsmanship',
    description: 'Direct from skilled artisans across India',
    icon: 'i-heroicons-hand-raised',
  },
  {
    title: 'Fair Prices',
    description: 'Support artisans with fair compensation',
    icon: 'i-heroicons-currency-rupee',
  },
  {
    title: 'Secure Transactions',
    description: 'Safe and encrypted payment processing',
    icon: 'i-heroicons-shield-check',
  },
  {
    title: 'Nationwide Delivery',
    description: 'Fast and reliable shipping across India',
    icon: 'i-heroicons-truck',
  },
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Discover Authentic Indian
            <span class="text-primary-600 dark:text-primary-400">Handicrafts</span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Connect directly with skilled artisans. Support traditional craftsmanship and economic growth.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton to="/products" size="xl" color="primary" icon="i-heroicons-shopping-bag">
              Browse Products
            </UButton>
            <UButton to="/auth/register" size="xl" variant="outline" icon="i-heroicons-user-plus">
              Become a Seller
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Shop by Category
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NuxtLink
            v-for="category in categories"
            :key="category.name"
            :to="`/products?category=${category.name.toLowerCase()}`"
            class="group"
          >
            <UCard class="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 mb-4 group-hover:scale-110 transition-transform">
                  <UIcon :name="category.icon" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ category.name }}</h3>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose CraftCart?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="text-center"
          >
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20 mb-4">
              <UIcon :name="feature.icon" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-600 dark:bg-primary-700">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Journey?
        </h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Whether you're an artisan looking to sell or a customer seeking authentic crafts, we're here to help.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton to="/auth/register" size="xl" color="white" variant="solid">
            Get Started
          </UButton>
          <UButton to="/about" size="xl" color="white" variant="outline">
            Learn More
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>
