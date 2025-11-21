<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Products</h1>
          <p class="mt-2 text-gray-600">Manage your product listings</p>
        </div>
        <AppButton
          color="indigo"
          to="/products/create"
        >
          ➕ Add New Product
        </AppButton>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500 mb-1">Total Products</div>
          <div class="text-3xl font-bold text-gray-900">{{ stats.total }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500 mb-1">Active</div>
          <div class="text-3xl font-bold text-green-600">{{ stats.active }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500 mb-1">Low Stock</div>
          <div class="text-3xl font-bold text-yellow-600">{{ stats.lowStock }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm text-gray-500 mb-1">Out of Stock</div>
          <div class="text-3xl font-bold text-red-600">{{ stats.outOfStock }}</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-8">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 3" :key="i" class="flex gap-4">
            <div class="w-24 h-24 bg-gray-200 rounded"></div>
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
        <AppButton @click="loadProducts">Try Again</AppButton>
      </div>

      <!-- Products Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="products.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
          <p class="text-gray-600 mb-4">Start by adding your first product</p>
          <AppButton to="/products/create" color="indigo">Add Product</AppButton>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in products" :key="product._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-16 w-16 flex-shrink-0">
                      <img
                        v-if="product.images && product.images.length > 0"
                        :src="product.images[0]"
                        :alt="product.title"
                        class="h-16 w-16 rounded object-cover"
                        @error="handleImageError"
                      />
                      <div v-else class="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        📦
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ product.title }}</div>
                      <div class="text-sm text-gray-500">{{ truncate(product.description, 50) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900 capitalize">{{ product.category }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">₹{{ product.price.toLocaleString() }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      product.stock === 0 ? 'bg-red-100 text-red-800' :
                      product.stock < 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ product.stock }} units
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ product.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <AppButton
                      variant="ghost"
                      size="sm"
                      :to="`/products/${product._id}`"
                      title="View"
                    >
                      👁️
                    </AppButton>
                    <AppButton
                      variant="ghost"
                      size="sm"
                      @click="editProduct(product._id)"
                      title="Edit"
                    >
                      ✏️
                    </AppButton>
                    <AppButton
                      variant="ghost"
                      size="sm"
                      :color="product.isActive ? 'yellow' : 'green'"
                      @click="toggleProductStatus(product)"
                      :title="product.isActive ? 'Hide Product' : 'Show Product'"
                    >
                      {{ product.isActive ? '🔒' : '✅' }}
                    </AppButton>
                    <AppButton
                      variant="ghost"
                      size="sm"
                      color="red"
                      @click="confirmDelete(product)"
                      title="Delete"
                    >
                      🗑️
                    </AppButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Delete Product</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "<strong>{{ productToDelete?.title }}</strong>"? This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <AppButton
            variant="outline"
            color="gray"
            class="flex-1"
            @click="showDeleteModal = false"
          >
            Cancel
          </AppButton>
          <AppButton
            color="red"
            class="flex-1"
            @click="deleteProduct"
            :disabled="deleting"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </AppButton>
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

interface Product {
  _id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  isActive: boolean
  rating: {
    average: number
    count: number
  }
}

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showDeleteModal = ref(false)
const productToDelete = ref<Product | null>(null)
const deleting = ref(false)

const stats = computed(() => ({
  total: products.value.length,
  active: products.value.filter(p => p.isActive).length,
  lowStock: products.value.filter(p => p.stock > 0 && p.stock < 5).length,
  outOfStock: products.value.filter(p => p.stock === 0).length,
}))

const loadProducts = async () => {
  if (!authStore.user) return

  loading.value = true
  error.value = null

  try {
    const response: any = await $fetch('/api/products/seller/my-products')
    products.value = response.data.products
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load products'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const editProduct = (productId: string) => {
  router.push(`/products/edit/${productId}`)
}

const toggleProductStatus = async (product: Product) => {
  try {
    const newStatus = !product.isActive
    await $fetch(`/api/products/${product._id}`, {
      method: 'PATCH',
      body: { isActive: newStatus },
    })

    // Update the product in the list
    product.isActive = newStatus
    toastStore.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`)
  } catch (e: any) {
    toastStore.error(e.data?.message || 'Failed to update product status')
    console.error(e)
  }
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value) return

  deleting.value = true

  try {
    await $fetch(`/api/products/${productToDelete.value._id}`, {
      method: 'DELETE',
    })

    products.value = products.value.filter(p => p._id !== productToDelete.value!._id)
    showDeleteModal.value = false
    productToDelete.value = null
    toastStore.success('Product deleted successfully')
  } catch (e: any) {
    toastStore.error(e.data?.message || 'Failed to delete product')
    console.error(e)
  } finally {
    deleting.value = false
  }
}

const truncate = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/100x100?text=No+Image'
}

onMounted(() => {
  loadProducts()
})
</script>
