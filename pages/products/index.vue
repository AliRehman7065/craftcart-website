<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-900">Discover Artisan Products</h1>
        <p class="mt-2 text-gray-600">Handcrafted items from talented artisans across the country</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 class="text-lg font-semibold mb-4">Filters</h2>

            <!-- Search -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search products..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @input="debouncedSearch"
              />
            </div>

            <!-- Category -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                v-model="filters.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @change="applyFilters"
              >
                <option value="">All Categories</option>
                <option value="handicrafts">Handicrafts</option>
                <option value="textiles">Textiles</option>
                <option value="pottery">Pottery</option>
                <option value="jewelry">Jewelry</option>
                <option value="home decor">Home Decor</option>
                <option value="paintings">Paintings</option>
                <option value="woodwork">Woodwork</option>
                <option value="metalwork">Metalwork</option>
              </select>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="filters.minPrice"
                  type="number"
                  placeholder="Min"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  @input="debouncedSearch"
                />
                <span class="text-gray-500">-</span>
                <input
                  v-model.number="filters.maxPrice"
                  type="number"
                  placeholder="Max"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  @input="debouncedSearch"
                />
              </div>
            </div>

            <!-- Clear Filters -->
            <AppButton
              variant="outline"
              color="gray"
              class="w-full"
              @click="clearFilters"
            >
              Clear Filters
            </AppButton>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="flex-1">
          <!-- Loading State -->
          <div v-if="productStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-md h-96 animate-pulse">
              <div class="h-64 bg-gray-200"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="productStore.error" class="text-center py-12">
            <p class="text-red-600 mb-4">{{ productStore.error }}</p>
            <AppButton @click="loadProducts">Try Again</AppButton>
          </div>

          <!-- Empty State -->
          <div v-else-if="productStore.products.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p class="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <AppButton @click="clearFilters">Clear Filters</AppButton>
          </div>

          <!-- Products Grid -->
          <div v-else>
            <div class="flex items-center justify-between mb-6">
              <p class="text-gray-600">
                Showing {{ productStore.products.length }} of {{ productStore.pagination.total }} products
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <ProductCard
                v-for="product in productStore.products"
                :key="product._id"
                :product="product"
              />
            </div>

            <!-- Pagination -->
            <div v-if="productStore.pagination.pages > 1" class="flex justify-center gap-2">
              <AppButton
                variant="outline"
                :disabled="filters.page === 1"
                @click="changePage(filters.page - 1)"
              >
                Previous
              </AppButton>
              
              <div class="flex items-center gap-2">
                <template v-for="page in visiblePages" :key="page">
                  <AppButton
                    v-if="page !== '...'"
                    :variant="page === filters.page ? 'solid' : 'outline'"
                    @click="changePage(page)"
                  >
                    {{ page }}
                  </AppButton>
                  <span v-else class="px-2 text-gray-500">...</span>
                </template>
              </div>

              <AppButton
                variant="outline"
                :disabled="filters.page === productStore.pagination.pages"
                @click="changePage(filters.page + 1)"
              >
                Next
              </AppButton>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '~/stores/productStore'

const productStore = useProductStore()
const route = useRoute()

const filters = reactive({
  search: '',
  category: '',
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  page: 1,
  limit: 12,
})

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.page = 1
    applyFilters()
  }, 500)
}

const applyFilters = () => {
  loadProducts()
}

const loadProducts = () => {
  const query: any = { ...filters }
  // Remove empty values
  Object.keys(query).forEach(key => {
    if (query[key] === '' || query[key] === undefined) {
      delete query[key]
    }
  })
  productStore.fetchProducts(query)
}

const clearFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.minPrice = undefined
  filters.maxPrice = undefined
  filters.page = 1
  loadProducts()
}

const changePage = (page: number) => {
  filters.page = page
  loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Calculate visible page numbers
const visiblePages = computed(() => {
  const pages = productStore.pagination.pages
  const current = filters.page
  const visible: (number | string)[] = []

  if (pages <= 7) {
    return Array.from({ length: pages }, (_, i) => i + 1)
  }

  visible.push(1)
  
  if (current > 3) visible.push('...')
  
  for (let i = Math.max(2, current - 1); i <= Math.min(pages - 1, current + 1); i++) {
    visible.push(i)
  }
  
  if (current < pages - 2) visible.push('...')
  
  visible.push(pages)

  return visible
})

// Load products on mount
onMounted(() => {
  // Check for query params
  if (route.query.category) {
    filters.category = route.query.category as string
  }
  loadProducts()
})
</script>
