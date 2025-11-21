<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Orders</h1>
        <p class="text-gray-600 mt-2">Track and manage your orders</p>
      </div>

      <!-- Stats Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Total Orders</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            </div>
            <div class="text-4xl">📦</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">In Progress</p>
              <p class="text-3xl font-bold text-orange-600 mt-2">{{ stats.inProgress }}</p>
            </div>
            <div class="text-4xl">⏳</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Delivered</p>
              <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.delivered }}</p>
            </div>
            <div class="text-4xl">✅</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Total Spent</p>
              <p class="text-3xl font-bold text-blue-600 mt-2">₹{{ stats.totalSpent.toLocaleString() }}</p>
            </div>
            <div class="text-4xl">💰</div>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="flex overflow-x-auto">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            :class="[
              'px-6 py-4 font-semibold whitespace-nowrap transition-colors',
              selectedFilter === filter.value
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p class="mt-4 text-gray-600">Loading your orders...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <div class="text-6xl mb-4">🛍️📦</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
        <p class="text-gray-600 mb-6">Start shopping to discover beautiful handcrafted products from talented artisans!</p>
        <button
          @click="$router.push('/products')"
          class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
        >
          Browse Products
        </button>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <!-- Order Header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Order #{{ order.orderNumber }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ formatDate(order.createdAt) }}</p>
              </div>
              <span
                :class="[
                  'px-4 py-2 rounded-full text-sm font-semibold',
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
              </span>
            </div>

            <!-- Order Details -->
            <div class="flex gap-4 mb-4">
              <img
                v-if="order.productImage"
                :src="order.productImage"
                :alt="order.productTitle"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900">{{ order.productTitle }}</h4>
                <p class="text-sm text-gray-600 mt-1">Quantity: {{ order.quantity }}</p>
                <p class="text-sm text-gray-600">Price: ₹{{ order.productPrice.toLocaleString() }} each</p>
                <p class="font-semibold text-gray-900 mt-2">Total: ₹{{ order.totalAmount.toLocaleString() }}</p>
              </div>
            </div>

            <!-- Seller Info -->
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
              <p class="text-sm font-semibold text-gray-900">Seller: {{ order.sellerName }}</p>
              <p class="text-sm text-gray-600">{{ order.sellerEmail }}</p>
            </div>

            <!-- Shipping Address -->
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
              <p class="text-sm font-semibold text-gray-900 mb-2">Shipping Address</p>
              <p class="text-sm text-gray-700">{{ order.shippingAddress.street }}</p>
              <p class="text-sm text-gray-700">{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
              <p class="text-sm text-gray-700 mt-1">Phone: {{ order.shippingAddress.phone }}</p>
            </div>

            <!-- Order Status Timeline -->
            <div class="mb-4">
              <div v-if="order.status === 'cancelled'" class="flex items-center justify-center gap-2 bg-red-50 p-3 rounded-lg">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <span class="text-sm font-semibold text-red-600">Order Cancelled</span>
              </div>
              <div v-else class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    ['pending', 'confirmed', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                  ]"></div>
                  <span class="text-xs text-gray-600">Placed</span>
                </div>
                <div class="flex-1 h-1 mx-2" :class="[
                  ['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                ]"></div>
                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    ['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                  ]"></div>
                  <span class="text-xs text-gray-600">Confirmed</span>
                </div>
                <div class="flex-1 h-1 mx-2" :class="[
                  ['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                ]"></div>
                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    ['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                  ]"></div>
                  <span class="text-xs text-gray-600">Shipped</span>
                </div>
                <div class="flex-1 h-1 mx-2" :class="[
                  order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                ]"></div>
                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                  ]"></div>
                  <span class="text-xs text-gray-600">Delivered</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t">
              <button
                @click="viewProduct(order.productId)"
                class="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-300 transition-colors"
              >
                View Product
              </button>
              <button
                @click="viewOrderDetails(order)"
                class="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
              >
                Order Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div
      v-if="showDetailsModal && selectedOrder"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDetailsModal = false"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">Order Details</h3>
          <button
            @click="showDetailsModal = false"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Order Info -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Order Information</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Order Number:</span>
                <p class="font-semibold">#{{ selectedOrder.orderNumber }}</p>
              </div>
              <div>
                <span class="text-gray-500">Status:</span>
                <p class="font-semibold capitalize">{{ selectedOrder.status }}</p>
              </div>
              <div>
                <span class="text-gray-500">Order Date:</span>
                <p class="font-semibold">{{ formatDate(selectedOrder.createdAt) }}</p>
              </div>
              <div>
                <span class="text-gray-500">Total Amount:</span>
                <p class="font-semibold text-lg">₹{{ selectedOrder.totalAmount.toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <!-- Product Details -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Product</h4>
            <div class="flex gap-4 bg-gray-50 p-4 rounded-lg">
              <img
                v-if="selectedOrder.productImage"
                :src="selectedOrder.productImage"
                :alt="selectedOrder.productTitle"
                class="w-24 h-24 object-cover rounded"
              />
              <div class="flex-1">
                <h5 class="font-semibold text-gray-900">{{ selectedOrder.productTitle }}</h5>
                <p class="text-sm text-gray-600 mt-1">Quantity: {{ selectedOrder.quantity }}</p>
                <p class="text-sm text-gray-600">Price: ₹{{ selectedOrder.productPrice.toLocaleString() }} each</p>
                <p class="font-semibold text-gray-900 mt-2">
                  Subtotal: ₹{{ (selectedOrder.quantity * selectedOrder.productPrice).toLocaleString() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Seller Info -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Seller Information</h4>
            <div class="bg-gray-50 p-4 rounded-lg text-sm">
              <p class="font-semibold">{{ selectedOrder.sellerName }}</p>
              <p class="text-gray-600">{{ selectedOrder.sellerEmail }}</p>
            </div>
          </div>

          <!-- Shipping Address -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Shipping Address</h4>
            <div class="bg-gray-50 p-4 rounded-lg text-sm">
              <p>{{ selectedOrder.shippingAddress.street }}</p>
              <p>{{ selectedOrder.shippingAddress.city }}, {{ selectedOrder.shippingAddress.state }}</p>
              <p>{{ selectedOrder.shippingAddress.zipCode }}</p>
              <p class="mt-2 font-semibold">Phone: {{ selectedOrder.shippingAddress.phone }}</p>
            </div>
          </div>

          <!-- Order Timeline -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Order Timeline</h4>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p class="font-semibold text-sm">Order Placed</p>
                  <p class="text-xs text-gray-600">{{ formatDate(selectedOrder.createdAt) }}</p>
                </div>
              </div>
              <div v-if="['confirmed', 'shipped', 'delivered'].includes(selectedOrder.status)" class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p class="font-semibold text-sm">Order Confirmed</p>
                  <p class="text-xs text-gray-600">Seller confirmed your order</p>
                </div>
              </div>
              <div v-if="['shipped', 'delivered'].includes(selectedOrder.status)" class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p class="font-semibold text-sm">Order Shipped</p>
                  <p class="text-xs text-gray-600">Your order is on the way</p>
                </div>
              </div>
              <div v-if="selectedOrder.status === 'delivered'" class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p class="font-semibold text-sm">Order Delivered</p>
                  <p class="text-xs text-gray-600">{{ formatDate(selectedOrder.updatedAt) }}</p>
                </div>
              </div>
              <div v-if="selectedOrder.status === 'cancelled'" class="flex items-start gap-3">
                <div class="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                <div>
                  <p class="font-semibold text-sm">Order Cancelled</p>
                  <p class="text-xs text-gray-600">{{ formatDate(selectedOrder.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <button
            @click="showDetailsModal = false"
            class="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '~/stores/toastStore'

definePageMeta({
  middleware: 'auth'
})

interface Order {
  id: string
  orderNumber: string
  productId: string
  productTitle: string
  productImage: string
  productPrice: number
  quantity: number
  totalAmount: number
  status: string
  sellerName: string
  sellerEmail: string
  sellerId: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  createdAt: string
  updatedAt: string
}

const toastStore = useToastStore()
const router = useRouter()

const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedFilter = ref('all')
const showDetailsModal = ref(false)
const selectedOrder = ref<Order | null>(null)

const filters = [
  { label: 'All Orders', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

const filteredOrders = computed(() => {
  if (selectedFilter.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === selectedFilter.value)
})

const stats = computed(() => {
  return {
    total: orders.value.length,
    inProgress: orders.value.filter(o => 
      ['pending', 'confirmed', 'shipped'].includes(o.status)
    ).length,
    delivered: orders.value.filter(o => o.status === 'delivered').length,
    totalSpent: orders.value
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0)
  }
})

const loadOrders = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch<Order[]>('/api/orders/my-orders')
    orders.value = response
  } catch (err: any) {
    console.error('Error loading orders:', err)
    error.value = err.message || 'Failed to load orders'
    toastStore.error('Failed to load orders')
  } finally {
    loading.value = false
  }
}

const viewProduct = (productId: string) => {
  router.push(`/products/${productId}`)
}

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadOrders()
})
</script>
