<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <AppButton variant="ghost" to="/seller/products" class="mb-4">
          ← Back to Products
        </AppButton>
        <h1 class="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p class="mt-2 text-gray-600">Update your product information</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-8">
        <div class="animate-pulse space-y-4">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow p-8 text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <AppButton to="/seller/products">Back to Products</AppButton>
      </div>

      <!-- Edit Form -->
      <form v-else @submit.prevent="updateProduct" class="bg-white rounded-lg shadow p-8 space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Product Title *
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter product title"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="4"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Describe your product..."
          />
        </div>

        <!-- Category and Price -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              v-model="formData.category"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="textiles">Textiles</option>
              <option value="pottery">Pottery</option>
              <option value="jewelry">Jewelry</option>
              <option value="woodwork">Woodwork</option>
              <option value="metalwork">Metalwork</option>
              <option value="paintings">Paintings</option>
              <option value="home-decor">Home Decor</option>
              <option value="handicrafts">Handicrafts</option>
            </select>
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              id="price"
              v-model.number="formData.price"
              type="number"
              min="0"
              step="1"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <!-- Stock -->
        <div>
          <label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
            Stock Quantity *
          </label>
          <input
            id="stock"
            v-model.number="formData.stock"
            type="number"
            min="0"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="0"
          />
        </div>

        <!-- Images -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Product Images (URLs)
          </label>
          <div class="space-y-3">
            <div v-for="(image, index) in formData.images" :key="index" class="flex gap-2">
              <input
                v-model="formData.images[index]"
                type="url"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <AppButton
                type="button"
                variant="outline"
                color="red"
                @click="removeImage(index)"
              >
                Remove
              </AppButton>
            </div>
            <AppButton
              type="button"
              variant="outline"
              @click="addImageField"
            >
              + Add Image URL
            </AppButton>
          </div>
        </div>

        <!-- Active Status -->
        <div class="flex items-center gap-3">
          <input
            id="isActive"
            v-model="formData.isActive"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label for="isActive" class="text-sm font-medium text-gray-700">
            Product is active and visible to customers
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="submitError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800">{{ submitError }}</p>
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-4 pt-4">
          <AppButton
            type="button"
            variant="outline"
            class="flex-1"
            @click="router.push('/seller/products')"
            :disabled="submitting"
          >
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            color="indigo"
            class="flex-1"
            :disabled="submitting"
          >
            {{ submitting ? 'Updating...' : 'Update Product' }}
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Check if user is a seller
watchEffect(() => {
  if (authStore.user && !authStore.isSeller) {
    router.push('/')
  }
})

const productId = route.params.id as string
const loading = ref(true)
const error = ref<string | null>(null)
const submitting = ref(false)
const submitError = ref<string | null>(null)

const formData = ref({
  title: '',
  description: '',
  price: 0,
  category: '',
  images: [''],
  stock: 0,
  isActive: true,
})

const loadProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const response: any = await $fetch(`/api/products/${productId}`)
    const product = response.data || response

    if (!product) {
      error.value = 'Product not found'
      return
    }

    formData.value = {
      title: product.title || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || '',
      images: product.images && product.images.length > 0 ? product.images : [''],
      stock: product.stock || 0,
      isActive: product.isActive !== undefined ? product.isActive : true,
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load product'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const addImageField = () => {
  formData.value.images.push('')
}

const removeImage = (index: number) => {
  if (formData.value.images.length > 1) {
    formData.value.images.splice(index, 1)
  }
}

const updateProduct = async () => {
  submitting.value = true
  submitError.value = null

  try {
    // Filter out empty image URLs
    const images = formData.value.images.filter(img => img.trim() !== '')

    await $fetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: {
        title: formData.value.title,
        description: formData.value.description,
        price: formData.value.price,
        category: formData.value.category,
        images,
        stock: formData.value.stock,
        isActive: formData.value.isActive,
      },
    })

    router.push('/seller/products')
  } catch (e: any) {
    submitError.value = e.data?.message || 'Failed to update product'
    console.error(e)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>
