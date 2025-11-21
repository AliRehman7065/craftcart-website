<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Success Icon -->
      <div class="mb-8">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-6xl">✅</span>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p class="text-xl text-gray-600">Thank you for your purchase</p>
      </div>

      <!-- Order Details -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Order Details</h2>
        <p class="text-gray-600 mb-6">
          Your order has been received and is being processed. You will receive an email confirmation shortly.
        </p>

        <div class="bg-gray-50 rounded-lg p-6 mb-6">
          <p class="text-sm text-gray-500 mb-2">Order ID</p>
          <p class="text-2xl font-bold text-gray-900">#{{ orderNumber || `ORD-${orderId.slice(-8).toUpperCase()}` }}</p>
        </div>

        <div class="space-y-2 text-left">
          <div class="flex justify-between py-2 border-b">
            <span class="text-gray-600">Status</span>
            <span class="font-semibold text-yellow-600">Pending</span>
          </div>
          <div class="flex justify-between py-2 border-b">
            <span class="text-gray-600">Payment Status</span>
            <span class="font-semibold text-yellow-600">Pending</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-gray-600">Estimated Delivery</span>
            <span class="font-semibold">5-7 Business Days</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <AppButton to="/customer/orders" color="indigo" size="lg">
          View My Orders
        </AppButton>
        <AppButton to="/products" variant="outline" size="lg">
          Continue Shopping
        </AppButton>
      </div>

      <!-- Additional Info -->
      <div class="mt-8 text-sm text-gray-500">
        <p>Questions about your order? Contact the seller directly from your orders page.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const orderId = route.params.id as string
const orderNumber = ref<string>(route.query.orderNumber as string || '')

// Fetch order details if order number not in query
onMounted(async () => {
  if (!orderNumber.value) {
    try {
      const orders = await $fetch<any[]>('/api/orders/my-orders')
      const order = orders.find(o => o.id === orderId)
      if (order) {
        orderNumber.value = order.orderNumber
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    }
  }
})
</script>
