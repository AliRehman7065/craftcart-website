<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="animate-pulse">
        <div class="bg-white rounded-lg shadow-md p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="h-96 bg-gray-200 rounded"></div>
            <div class="space-y-4">
              <div class="h-8 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <AppButton to="/products">Back to Products</AppButton>
      </div>

      <!-- Product Detail -->
      <div v-else-if="product" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <!-- Product Images -->
          <div class="space-y-4">
            <div class="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              <img
                v-if="product.images && product.images.length > 0"
                :src="product.images[currentImageIndex]"
                :alt="product.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <span class="text-9xl">📦</span>
              </div>
            </div>

            <!-- Image Thumbnails -->
            <div v-if="product.images && product.images.length > 1" class="grid grid-cols-4 gap-2">
              <button
                v-for="(image, index) in product.images"
                :key="index"
                @click="currentImageIndex = index"
                :class="[
                  'h-24 rounded-lg overflow-hidden border-2 transition-colors',
                  currentImageIndex === index ? 'border-indigo-600' : 'border-gray-200'
                ]"
              >
                <img 
                  :src="image" 
                  :alt="`${product.title} - ${index + 1}`" 
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Category & Stock -->
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-indigo-600 uppercase">{{ product.category }}</span>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-semibold',
                  product.stock === 0 ? 'bg-red-100 text-red-800' :
                  product.stock < 5 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                ]"
              >
                {{ product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock` }}
              </span>
            </div>

            <!-- Title & Rating -->
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.title }}</h1>
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <span class="text-yellow-400">⭐</span>
                  <span class="font-semibold">{{ product.rating?.average?.toFixed(1) || '0.0' }}</span>
                  <span class="text-gray-500">({{ product.rating?.count || 0 }} reviews)</span>
                </div>
              </div>
            </div>

            <!-- Price -->
            <div class="border-t border-b border-gray-200 py-4">
              <div class="text-4xl font-bold text-gray-900">₹{{ product.price.toLocaleString() }}</div>
            </div>

            <!-- Description -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
            </div>

            <!-- Seller Info -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Seller Information</h3>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {{ product.seller?.name?.charAt(0).toUpperCase() || 'S' }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ product.seller?.name || 'Unknown Seller' }}</p>
                  <p class="text-sm text-gray-500">Artisan Seller</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <AppButton
                v-if="product.stock > 0"
                color="indigo"
                class="w-full py-3 text-lg"
                @click="addToCart"
              >
                🛒 Add to Cart
              </AppButton>
              <AppButton
                v-else
                color="gray"
                variant="outline"
                class="w-full py-3 text-lg"
                disabled
              >
                Out of Stock
              </AppButton>

              <AppButton
                variant="outline"
                color="indigo"
                class="w-full py-3"
                @click="contactSeller"
              >
                💬 Contact Seller
              </AppButton>
            </div>
          </div>
        </div>

        <!-- Additional Details -->
        <div class="border-t border-gray-200 p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Category</h3>
              <p class="text-gray-700">{{ product.category }}</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">Availability</h3>
              <p class="text-gray-700">{{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthModal
      :is-open="showAuthModal"
      title="Sign In Required"
      message="Please sign in or create an account to add items to your cart."
      @close="showAuthModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '~/stores/productStore'
import { useAuthStore } from '~/stores/authStore'
import { useCartStore } from '~/stores/cartStore'
import { useToastStore } from '~/stores/toastStore'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toastStore = useToastStore()

const product = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const currentImageIndex = ref(0)
const showAuthModal = ref(false)

const loadProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const id = route.params.id as string
    const response: any = await productStore.fetchProductById(id)
    
    if (!response) {
      error.value = 'Product not found'
    } else {
      product.value = response
    }
  } catch (e: any) {
    error.value = 'Failed to load product'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }
  
  if (!product.value) return
  
  if (product.value.stock === 0) {
    toastStore.error('This product is out of stock')
    return
  }
  
  try {
    cartStore.addToCart(product.value)
    toastStore.success(`${product.value.title} added to cart! 🛒`)
  } catch (error: any) {
    toastStore.error(error.message || 'Failed to add to cart')
  }
}

const contactSeller = () => {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }
  
  if (!product.value?.seller) return
  
  // For now, show seller contact info
  toastStore.info(`Seller: ${product.value.seller.name} | Email: ${product.value.seller.email}`, 5000)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available'
}

onMounted(() => {
  loadProduct()
  cartStore.loadFromLocalStorage()
})
</script>
