<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p class="mt-2 text-gray-600">Review your items before checkout</p>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cartStore.isEmpty" class="bg-white rounded-lg shadow p-12 text-center">
        <div class="text-6xl mb-4">🛒</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p class="text-gray-600 mb-6">Add some products to get started!</p>
        <AppButton to="/products" color="indigo">Browse Products</AppButton>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.cartItems"
            :key="item.productId"
            class="bg-white rounded-lg shadow p-6"
          >
            <div class="flex gap-6">
              <!-- Product Image -->
              <NuxtLink :to="`/products/${item.productId}`" class="flex-shrink-0">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="w-24 h-24 object-cover rounded"
                  @error="handleImageError"
                />
                <div v-else class="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  📦
                </div>
              </NuxtLink>

              <!-- Product Info -->
              <div class="flex-1">
                <NuxtLink
                  :to="`/products/${item.productId}`"
                  class="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                >
                  {{ item.title }}
                </NuxtLink>
                <p class="text-sm text-gray-500 mt-1">Seller: {{ item.sellerName }}</p>
                <p class="text-lg font-bold text-gray-900 mt-2">₹{{ item.price.toLocaleString() }}</p>
                <p class="text-sm text-gray-500">{{ item.stock }} available</p>
              </div>

              <!-- Quantity Controls -->
              <div class="flex flex-col items-end gap-4">
                <div class="flex items-center gap-3">
                  <button
                    @click="decreaseQuantity(item)"
                    :disabled="item.quantity <= 1"
                    class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span class="text-lg font-semibold w-12 text-center">{{ item.quantity }}</span>
                  <button
                    @click="increaseQuantity(item)"
                    :disabled="item.quantity >= item.stock"
                    class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                <!-- Remove Button -->
                <AppButton
                  variant="ghost"
                  color="red"
                  size="sm"
                  @click="removeItem(item.productId)"
                >
                  🗑️ Remove
                </AppButton>

                <!-- Item Total -->
                <div class="text-right">
                  <p class="text-sm text-gray-500">Subtotal</p>
                  <p class="text-xl font-bold text-gray-900">₹{{ (item.price * item.quantity).toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div class="space-y-3 mb-4">
              <div class="flex justify-between text-gray-600">
                <span>Items ({{ cartStore.cartCount }})</span>
                <span>₹{{ cartStore.cartTotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{{ shippingCost.toLocaleString() }}</span>
              </div>
              <div class="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>₹{{ (cartStore.cartTotal + shippingCost).toLocaleString() }}</span>
              </div>
            </div>

            <button
              @click="proceedToCheckout"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              Proceed to Checkout
            </button>

            <button
              @click="router.push('/products')"
              class="w-full mt-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cartStore'
import { useAuthStore } from '~/stores/authStore'
import { useToastStore } from '~/stores/toastStore'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const shippingCost = computed(() => {
  // Free shipping over ₹1000
  return cartStore.cartTotal >= 1000 ? 0 : 50
})

const increaseQuantity = (item: any) => {
  if (item.quantity < item.stock) {
    cartStore.updateQuantity(item.productId, item.quantity + 1)
  }
}

const decreaseQuantity = (item: any) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.productId, item.quantity - 1)
  }
}

const toastStore = useToastStore()

const removeItem = (productId: string) => {
  cartStore.removeFromCart(productId)
  toastStore.success('Item removed from cart')
}

const proceedToCheckout = () => {
  router.push('/checkout')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/100x100?text=No+Image'
}

onMounted(() => {
  cartStore.loadFromLocalStorage()
  
  // Redirect sellers to dashboard
  if (authStore.isSeller) {
    router.push('/seller/dashboard')
  }
})
</script>
