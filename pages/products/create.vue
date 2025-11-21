<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
        <p class="text-gray-600 mb-8">List your handcrafted product on CraftCart</p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Product Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Product Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="e.g., Handwoven Cotton Throw Blanket"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              placeholder="Describe your product in detail..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <!-- Category & Price -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Category <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.category"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
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

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.price"
                type="number"
                required
                min="0"
                placeholder="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <!-- Stock -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.stock"
              type="number"
              required
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Image URLs -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Product Images <span class="text-red-500">*</span>
            </label>
            <p class="text-sm text-gray-500 mb-2">Enter image URLs (one per line)</p>
            <textarea
              v-model="imageUrls"
              rows="4"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Tip: You can use image hosting services like Imgur or Cloudinary</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ error }}
          </div>

          <!-- Success Message -->
          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Product created successfully! Redirecting...
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-4">
            <AppButton
              type="submit"
              color="indigo"
              class="flex-1"
              :disabled="loading"
            >
              {{ loading ? 'Creating...' : '✅ Create Product' }}
            </AppButton>
            <AppButton
              type="button"
              variant="outline"
              color="gray"
              @click="$router.push('/seller/dashboard')"
            >
              Cancel
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const authStore = useAuthStore()

// Check if user is a seller
watchEffect(() => {
  if (authStore.user && !authStore.isSeller) {
    router.push('/')
  }
})

const form = reactive({
  title: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
})

const imageUrls = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    // Parse image URLs
    const images = imageUrls.value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    if (images.length === 0) {
      error.value = 'Please add at least one product image'
      loading.value = false
      return
    }

    const { data } = await $fetch('/api/products', {
      method: 'POST',
      body: {
        ...form,
        images,
      },
    })

    success.value = true
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/seller/dashboard')
    }, 2000)
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to create product'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
