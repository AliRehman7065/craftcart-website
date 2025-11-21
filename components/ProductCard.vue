<template>
  <NuxtLink :to="`/products/${product._id}`" class="block group">
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <!-- Product Image -->
      <div class="relative h-64 bg-gray-200 overflow-hidden">
        <img
          v-if="product.images && product.images.length > 0"
          :src="product.images[0]"
          :alt="product.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          <span class="text-6xl">📦</span>
        </div>
        
        <!-- Stock Badge -->
        <div v-if="product.stock < 5" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
          {{ product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} left` }}
        </div>
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <!-- Category -->
        <div class="text-xs text-indigo-600 font-semibold uppercase mb-1">
          {{ product.category }}
        </div>

        <!-- Title -->
        <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {{ product.title }}
        </h3>

        <!-- Rating -->
        <div class="flex items-center gap-1 mb-2">
          <span class="text-yellow-400">⭐</span>
          <span class="text-sm text-gray-700">
            {{ product.rating?.average?.toFixed(1) || '0.0' }}
          </span>
          <span class="text-xs text-gray-500">
            ({{ product.rating?.count || 0 }})
          </span>
        </div>

        <!-- Price and Seller -->
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold text-gray-900">
            ₹{{ product.price.toLocaleString() }}
          </div>
          <div class="text-xs text-gray-500">
            by {{ product.seller?.name || 'Unknown' }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  product: {
    _id: string
    title: string
    description: string
    price: number
    category: string
    images: string[]
    seller: {
      _id: string
      name: string
    }
    stock: number
    rating: {
      average: number
      count: number
    }
  }
}>()
</script>
