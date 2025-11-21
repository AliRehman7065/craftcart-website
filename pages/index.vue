<script setup lang="ts">
const categories = [
  { name: 'Handicrafts', icon: '🎨', color: 'from-pink-400 to-pink-600', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
  { name: 'Textiles', icon: '🧵', color: 'from-purple-400 to-purple-600', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400' },
  { name: 'Pottery', icon: '🏺', color: 'from-orange-400 to-orange-600', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400' },
  { name: 'Jewelry', icon: '💎', color: 'from-yellow-400 to-yellow-600', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400' },
  { name: 'Home Decor', icon: '🏠', color: 'from-green-400 to-green-600', image: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400' },
  { name: 'Paintings', icon: '🖼️', color: 'from-blue-400 to-blue-600', image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400' },
  { name: 'Woodwork', icon: '🪵', color: 'from-amber-400 to-amber-600', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400' },
  { name: 'Metalwork', icon: '🔨', color: 'from-gray-400 to-gray-600', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400' },
]

const featuredProducts = ref<any[]>([])
const newArrivals = ref<any[]>([])
const loading = ref(true)

const loadProducts = async () => {
  try {
    // Fetch more products for better variety
    const response: any = await $fetch('/api/products?limit=20&sortBy=createdAt&sortOrder=desc')
    const allProducts = response.data.products || []
    
    if (allProducts.length > 0) {
      // Shuffle and get 4 random featured products
      const shuffled = [...allProducts].sort(() => Math.random() - 0.5)
      featuredProducts.value = shuffled.slice(0, 4)
      
      // Get 4 newest products (already sorted by createdAt desc)
      newArrivals.value = allProducts.slice(0, 4)
    }
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Authentic Indian
            <span class="text-orange-600">Handicrafts</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect directly with skilled artisans. Support traditional craftsmanship and empower Indian artisans.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/products"
              class="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Browse Products
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="px-8 py-4 bg-white hover:bg-gray-50 text-orange-600 font-semibold rounded-lg border-2 border-orange-600 transition-colors text-lg"
            >
              Become a Seller
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Shop by Category -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p class="text-gray-600">Explore our curated collection of authentic handicrafts</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="category in categories"
            :key="category.name"
            :to="`/products?category=${category.name}`"
            class="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div class="aspect-square relative">
              <img
                :src="category.image"
                :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div :class="`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`"></div>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <span class="text-4xl mb-2">{{ category.icon }}</span>
                <h3 class="font-bold text-lg text-center">{{ category.name }}</h3>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p class="text-gray-600">Handpicked by our curators</p>
          </div>
          <NuxtLink to="/products" class="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-2">
            View All
            <span>→</span>
          </NuxtLink>
        </div>
        
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow p-4 animate-pulse">
            <div class="aspect-square bg-gray-200 rounded mb-4"></div>
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="product in featuredProducts"
            :key="product._id"
            :to="`/products/${product._id}`"
            class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow group"
          >
            <div class="aspect-square overflow-hidden rounded-t-lg relative">
              <img
                :src="product.images[0]"
                :alt="product.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div class="absolute top-2 right-2 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                New
              </div>
            </div>
            <div class="p-4">
              <p class="text-xs text-gray-500 uppercase mb-1">{{ product.category }}</p>
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ product.title }}</h3>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-orange-600">₹{{ product.price.toLocaleString() }}</span>
                <span class="text-sm text-gray-500">{{ product.stock }} in stock</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">New Arrivals</h2>
            <p class="text-gray-600">Latest additions to our collection</p>
          </div>
          <NuxtLink to="/products?sort=newest" class="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-2">
            View All
            <span>→</span>
          </NuxtLink>
        </div>
        
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow p-4 animate-pulse">
            <div class="aspect-square bg-gray-200 rounded mb-4"></div>
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="product in newArrivals"
            :key="product._id"
            :to="`/products/${product._id}`"
            class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow group"
          >
            <div class="aspect-square overflow-hidden rounded-t-lg">
              <img
                :src="product.images[0]"
                :alt="product.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div class="p-4">
              <p class="text-xs text-gray-500 uppercase mb-1">{{ product.category }}</p>
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ product.title }}</h3>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-orange-600">₹{{ product.price.toLocaleString() }}</span>
                <span class="text-sm text-gray-500">{{ product.stock }} in stock</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-16 bg-orange-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white mb-2">Why Choose CraftCart?</h2>
          <p class="text-orange-100">Your trusted marketplace for authentic handicrafts</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">✨</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Authentic Craftsmanship</h3>
            <p class="text-orange-100">100% handmade by skilled artisans</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">💰</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Fair Prices</h3>
            <p class="text-orange-100">Direct from artisans, no middlemen</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">🔒</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Secure Payments</h3>
            <p class="text-orange-100">Safe and encrypted transactions</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">🚚</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
            <p class="text-orange-100">Nationwide shipping across India</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Journey?
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Whether you're an artisan looking to sell or a customer seeking authentic crafts, join us today.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/auth/register"
            class="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Get Started
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors text-lg"
          >
            Learn More
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
