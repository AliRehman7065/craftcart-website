<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

// Wait for auth check
const loading = ref(true)
const stats = ref({
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  confirmedOrders: 0,
  shippedOrders: 0,
  deliveredOrders: 0,
  cancelledOrders: 0,
})
const recentProducts = ref<any[]>([])
const topSellingProducts = ref<any[]>([])
const recentOrders = ref<any[]>([])

const loadDashboardData = async () => {
  try {
    // Fetch seller's products
    const productsResponse: any = await $fetch('/api/products/seller/my-products')
    const products = productsResponse.data.products || []
    
    stats.value.totalProducts = products.length
    
    // Get 5 most recent products
    recentProducts.value = products.slice(0, 5)
    
    // Fetch seller's orders
    const ordersResponse: any = await $fetch('/api/orders/seller/my-orders')
    const orders = ordersResponse.data.orders || []
    
    // Calculate order stats
    stats.value.totalOrders = orders.length
    stats.value.pendingOrders = orders.filter((o: any) => o.status === 'pending').length
    stats.value.confirmedOrders = orders.filter((o: any) => o.status === 'confirmed').length
    stats.value.shippedOrders = orders.filter((o: any) => o.status === 'shipped').length
    stats.value.deliveredOrders = orders.filter((o: any) => o.status === 'delivered').length
    stats.value.cancelledOrders = orders.filter((o: any) => o.status === 'cancelled').length
    
    // Calculate total revenue (exclude cancelled orders)
    stats.value.totalRevenue = orders
      .filter((o: any) => o.status !== 'cancelled')
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0)
    
    // Get recent orders (last 5)
    recentOrders.value = orders.slice(0, 5)
    
    // Calculate top selling products
    const productSales = new Map<string, { product: any; quantity: number; revenue: number }>()
    
    orders.forEach((order: any) => {
      const productId = order.items[0].productId
      const productTitle = order.items[0].productTitle
      const productImage = order.items[0].productImage
      const quantity = order.items[0].quantity
      const revenue = order.totalAmount
      
      if (order.status !== 'cancelled') {
        if (productSales.has(productId)) {
          const existing = productSales.get(productId)!
          existing.quantity += quantity
          existing.revenue += revenue
        } else {
          productSales.set(productId, {
            product: {
              id: productId,
              title: productTitle,
              image: productImage,
            },
            quantity,
            revenue,
          })
        }
      }
    })
    
    // Sort by quantity sold and get top 5
    topSellingProducts.value = Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

onMounted(async () => {
  await authStore.checkAuth()
  
  // Redirect if not authenticated or not a seller
  if (!authStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  
  if (!authStore.isSeller) {
    router.push('/')
    return
  }
  
  await loadDashboardData()
  loading.value = false
})
</script>

<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
  
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Welcome Header -->
      <div class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {{ authStore.user?.name }}! 👋
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Here's what's happening with your shop today
          </p>
        </div>
        <NuxtLink
          to="/seller/help"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>❓</span>
          <span>Help Center</span>
        </NuxtLink>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AppCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Products</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalProducts }}</p>
            </div>
            <div class="text-4xl">📦</div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalOrders }}</p>
            </div>
            <div class="text-4xl">🛒</div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p class="text-3xl font-bold text-green-600">₹{{ stats.totalRevenue.toLocaleString() }}</p>
            </div>
            <div class="text-4xl">💰</div>
          </div>
        </AppCard>

        <AppCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Orders</p>
              <p class="text-3xl font-bold text-orange-600">{{ stats.pendingOrders }}</p>
            </div>
            <div class="text-4xl">⏳</div>
          </div>
        </AppCard>
      </div>

      <!-- Order Status Overview -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
              <p class="text-2xl font-bold text-blue-600">{{ stats.confirmedOrders }}</p>
            </div>
            <div class="text-3xl">✓</div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Shipped</p>
              <p class="text-2xl font-bold text-purple-600">{{ stats.shippedOrders }}</p>
            </div>
            <div class="text-3xl">🚚</div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.deliveredOrders }}</p>
            </div>
            <div class="text-3xl">✅</div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Cancelled</p>
              <p class="text-2xl font-bold text-red-600">{{ stats.cancelledOrders }}</p>
            </div>
            <div class="text-3xl">✖</div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p class="text-2xl font-bold text-indigo-600">{{ stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0 }}%</p>
            </div>
            <div class="text-3xl">📊</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppCard class="hover:shadow-lg transition-shadow cursor-pointer">
            <NuxtLink to="/products/create" class="block text-center p-4">
              <div class="text-4xl mb-2">➕</div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Add New Product</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">List a new handicraft item</p>
            </NuxtLink>
          </AppCard>

          <AppCard class="hover:shadow-lg transition-shadow cursor-pointer">
            <NuxtLink to="/seller/products" class="block text-center p-4">
              <div class="text-4xl mb-2">📋</div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Manage Products</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Edit or remove listings</p>
            </NuxtLink>
          </AppCard>

          <AppCard class="hover:shadow-lg transition-shadow cursor-pointer">
            <NuxtLink to="/seller/orders" class="block text-center p-4">
              <div class="text-4xl mb-2">📦</div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">View Orders</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Manage customer orders</p>
            </NuxtLink>
          </AppCard>
        </div>
      </div>

      <!-- Top Selling Products & Recent Orders -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Top Selling Products -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Top Selling Products</h2>
          <AppCard>
            <div v-if="topSellingProducts.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📈</div>
              <p class="text-gray-600 dark:text-gray-400">No sales data yet</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="(item, index) in topSellingProducts"
                :key="item.product.id"
                class="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div class="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <span class="text-sm font-bold text-orange-600 dark:text-orange-400">#{{ index + 1 }}</span>
                </div>
                <img
                  v-if="item.product.image"
                  :src="item.product.image"
                  :alt="item.product.title"
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 dark:text-white truncate">{{ item.product.title }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.quantity }} units sold</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-green-600">₹{{ item.revenue.toLocaleString() }}</p>
                  <p class="text-xs text-gray-500">revenue</p>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Recent Orders -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
          <AppCard>
            <div v-if="recentOrders.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📦</div>
              <p class="text-gray-600 dark:text-gray-400">No orders yet</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="order in recentOrders"
                :key="order._id"
                class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                @click="$router.push('/seller/orders')"
              >
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">#{{ order.orderNumber }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ order.buyerName }}</p>
                  </div>
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
                    {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <img
                    v-if="order.items[0].productImage"
                    :src="order.items[0].productImage"
                    :alt="order.items[0].productTitle"
                    class="w-12 h-12 object-cover rounded"
                  />
                  <div class="flex-1">
                    <p class="text-sm text-gray-900 dark:text-white">{{ order.items[0].productTitle }}</p>
                    <p class="text-xs text-gray-500">Qty: {{ order.items[0].quantity }}</p>
                  </div>
                  <p class="font-bold text-gray-900 dark:text-white">₹{{ order.totalAmount.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>

      <!-- Recent Activity -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Products</h2>
        <AppCard>
          <div v-if="recentProducts.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">🎨</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start Your Journey</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Add your first product to start selling your beautiful handicrafts!
            </p>
            <AppButton to="/products/create" size="lg" color="primary">
              Add Your First Product
            </AppButton>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="product in recentProducts" :key="product._id" class="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <img
                v-if="product.images && product.images.length > 0"
                :src="product.images[0]"
                :alt="product.title"
                class="w-16 h-16 rounded object-cover"
              />
              <div v-else class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400">
                📦
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ product.title }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ product.category }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900 dark:text-white">₹{{ product.price.toLocaleString() }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ product.stock }} in stock</p>
              </div>
            </div>
            
            <AppButton variant="outline" to="/seller/products" class="w-full mt-4">
              View All Products
            </AppButton>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>
