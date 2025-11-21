<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
        <p class="mt-2 text-gray-600">Manage your customer orders</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500 mb-1">Total Orders</div>
          <div class="text-3xl font-bold text-gray-900">{{ stats.total }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500 mb-1">Pending</div>
          <div class="text-3xl font-bold text-yellow-600">{{ stats.pending }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500 mb-1">Processing</div>
          <div class="text-3xl font-bold text-blue-600">{{ stats.processing }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500 mb-1">Completed</div>
          <div class="text-3xl font-bold text-green-600">{{ stats.completed }}</div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="status in filterOptions"
              :key="status.value"
              @click="selectedFilter = status.value"
              :class="[
                'py-4 px-6 text-sm font-medium border-b-2 transition-colors',
                selectedFilter === status.value
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ status.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-8">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 3" :key="i" class="flex gap-4">
            <div class="w-20 h-20 bg-gray-200 rounded"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow p-8 text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <AppButton @click="loadOrders">Try Again</AppButton>
      </div>

      <!-- Orders List -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="filteredOrders.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p class="text-gray-600">Orders from customers will appear here</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="order in filteredOrders"
            :key="order._id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <!-- Order Header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">Order #{{ order.orderNumber }}</h3>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ order.status.toUpperCase() }}
                  </span>
                </div>
                <div class="text-sm text-gray-500">
                  <p>Customer: {{ order.buyerName }}</p>
                  <p>Placed: {{ formatDate(order.createdAt) }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-900">₹{{ order.totalAmount.toLocaleString() }}</div>
                <div class="text-sm text-gray-500">{{ order.items.length }} item(s)</div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="space-y-3 mb-4">
              <div
                v-for="item in order.items"
                :key="item.productId"
                class="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
              >
                <img
                  v-if="item.productImage"
                  :src="item.productImage"
                  :alt="item.productTitle"
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ item.productTitle }}</h4>
                  <p class="text-sm text-gray-500">Qty: {{ item.quantity }} × ₹{{ item.price.toLocaleString() }}</p>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900">₹{{ (item.quantity * item.price).toLocaleString() }}</div>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h4>
              <p class="text-sm text-gray-600">
                {{ order.shippingAddress.street }}<br>
                {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}<br>
                Phone: {{ order.shippingAddress.phone }}
              </p>
            </div>

            <!-- Order Actions -->
            <div class="flex gap-2 flex-wrap">
              <button
                v-if="order.status === 'pending'"
                @click="updateOrderStatus(order._id, 'confirmed')"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                ✓ Confirm Order
              </button>
              <button
                v-if="order.status === 'confirmed'"
                @click="updateOrderStatus(order._id, 'shipped')"
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                🚚 Ship Order
              </button>
              <button
                v-if="order.status === 'shipped'"
                @click="updateOrderStatus(order._id, 'delivered')"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                ✅ Mark Delivered
              </button>
              <button
                v-if="order.status === 'pending' || order.status === 'confirmed'"
                @click="confirmCancelOrder(order)"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                ✖ Cancel Order
              </button>
              <button
                @click="viewOrderDetails(order)"
                class="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg border-2 border-gray-300 transition-colors"
              >
                👁️ View Details
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

          <!-- Customer Info -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Customer Information</h4>
            <div class="bg-gray-50 p-4 rounded-lg text-sm">
              <p class="font-semibold">{{ selectedOrder.buyerName }}</p>
              <p class="text-gray-600">{{ selectedOrder.buyerEmail }}</p>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Items</h4>
            <div class="space-y-3">
              <div
                v-for="item in selectedOrder.items"
                :key="item.productId"
                class="flex gap-4 bg-gray-50 p-4 rounded-lg"
              >
                <img
                  v-if="item.productImage"
                  :src="item.productImage"
                  :alt="item.productTitle"
                  class="w-20 h-20 object-cover rounded"
                />
                <div class="flex-1">
                  <h5 class="font-semibold text-gray-900">{{ item.productTitle }}</h5>
                  <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
                  <p class="text-sm text-gray-600">Price: ₹{{ item.price.toLocaleString() }} each</p>
                  <p class="font-semibold text-gray-900 mt-1">
                    Subtotal: ₹{{ (item.quantity * item.price).toLocaleString() }}
                  </p>
                </div>
              </div>
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
import { useAuthStore } from '~/stores/authStore'
import { useToastStore } from '~/stores/toastStore'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

// Check if user is a seller
watchEffect(() => {
  if (authStore.user && !authStore.isSeller) {
    router.push('/')
  }
})

interface OrderItem {
  productId: string
  productTitle: string
  productImage: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  orderNumber: string
  buyerId: string
  buyerName: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
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

const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedFilter = ref('all')
const showDetailsModal = ref(false)
const selectedOrder = ref<Order | null>(null)

const filterOptions = [
  { label: 'All Orders', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

const stats = computed(() => ({
  total: orders.value.length,
  pending: orders.value.filter(o => o.status === 'pending').length,
  processing: orders.value.filter(o => o.status === 'confirmed' || o.status === 'shipped').length,
  completed: orders.value.filter(o => o.status === 'delivered').length,
}))

const filteredOrders = computed(() => {
  if (selectedFilter.value === 'all') {
    return orders.value
  }
  return orders.value.filter(o => o.status === selectedFilter.value)
})

const loadOrders = async () => {
  if (!authStore.user) return

  loading.value = true
  error.value = null

  try {
    const response: any = await $fetch('/api/orders/seller/my-orders')
    orders.value = response.data.orders || []
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load orders'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    await $fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status: newStatus },
    })

    // Update local order
    const order = orders.value.find(o => o._id === orderId)
    if (order) {
      order.status = newStatus as any
      toastStore.success(`Order marked as ${newStatus}`)
    }
  } catch (e: any) {
    toastStore.error(e.data?.message || 'Failed to update order status')
    console.error(e)
  }
}

const confirmCancelOrder = (order: Order) => {
  if (confirm(`Are you sure you want to cancel order #${order.orderNumber}?`)) {
    updateOrderStatus(order._id, 'cancelled')
  }
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
