<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Checkout</h1>
        <p class="mt-2 text-gray-600">Complete your order</p>
      </div>

      <!-- Checkout Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Shipping Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="placeOrder" class="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>

            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                v-model="shippingAddress.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                id="phone"
                v-model="shippingAddress.phone"
                type="tel"
                required
                pattern="[0-9]{10}"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="1234567890"
              />
            </div>

            <!-- Street Address -->
            <div>
              <label for="street" class="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                id="street"
                v-model="shippingAddress.street"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="123 Main Street, Apartment 4B"
              />
            </div>

            <!-- City and State -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  id="city"
                  v-model="shippingAddress.city"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label for="state" class="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  id="state"
                  v-model="shippingAddress.state"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Maharashtra"
                />
              </div>
            </div>

            <!-- Pincode -->
            <div>
              <label for="pincode" class="block text-sm font-medium text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                id="pincode"
                v-model="shippingAddress.pincode"
                type="text"
                required
                pattern="[0-9]{6}"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="400001"
              />
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-800">{{ error }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              {{ submitting ? 'Placing Order...' : 'Place Order' }}
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <!-- Cart Items -->
            <div class="space-y-3 mb-4 max-h-64 overflow-y-auto">
              <div
                v-for="item in cartStore.cartItems"
                :key="item.productId"
                class="flex gap-3 pb-3 border-b"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex-1">
                  <p class="font-medium text-sm">{{ item.title }}</p>
                  <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                  <p class="text-sm font-semibold">₹{{ (item.price * item.quantity).toLocaleString() }}</p>
                </div>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{{ cartStore.cartTotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{{ shippingCost.toLocaleString() }}</span>
              </div>
              <div class="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{{ (cartStore.cartTotal + shippingCost).toLocaleString() }}</span>
              </div>
            </div>

            <p class="text-xs text-gray-500 text-center">
              By placing your order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cartStore'
import { useAuthStore } from '~/stores/authStore'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const shippingAddress = ref({
  name: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
})

const submitting = ref(false)
const error = ref<string | null>(null)

const shippingCost = computed(() => {
  return cartStore.cartTotal >= 1000 ? 0 : 50
})

const placeOrder = async () => {
  if (cartStore.isEmpty) {
    error.value = 'Your cart is empty'
    return
  }

  submitting.value = true
  error.value = null

  try {
    const orderData = {
      items: cartStore.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        sellerId: item.sellerId,
      })),
      shippingAddress: shippingAddress.value,
      totalAmount: cartStore.cartTotal + shippingCost.value,
    }

    const response: any = await $fetch('/api/orders/create', {
      method: 'POST',
      body: orderData,
    })

    // Clear cart after successful order
    cartStore.clearCart()

    // Redirect to success page with order number
    const orderNumber = response.data.orderNumber || response.data.orders[0]?.orderNumber
    router.push(`/order-success/${response.data.orderId}?orderNumber=${orderNumber}`)
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to place order. Please try again.'
    console.error(e)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  cartStore.loadFromLocalStorage()

  // Redirect if cart is empty
  if (cartStore.isEmpty) {
    router.push('/cart')
  }

  // Redirect sellers
  if (authStore.isSeller) {
    router.push('/seller/dashboard')
  }

  // Pre-fill name from user data
  if (authStore.user) {
    shippingAddress.value.name = authStore.user.name || ''
    shippingAddress.value.phone = authStore.user.phone || ''
  }
})
</script>
