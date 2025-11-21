import { defineStore } from 'pinia'

interface Product {
  _id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  seller: {
    _id: string
    name: string
  }
  stock: number
  rating: {
    average: number
    count: number
  }
}

interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  page?: number
  limit?: number
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  const fetchProducts = async (filters?: ProductFilters) => {
    loading.value = true
    error.value = null

    try {
      const response: any = await $fetch('/api/products', {
        query: filters,
      })

      products.value = response.data.products
      pagination.value = response.data.pagination
    } catch (e: any) {
      error.value = 'Failed to load products'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response: any = await $fetch(`/api/products/${id}`)
      console.log('Product API response:', response)
      // API returns { success: true, data: { product details } }
      return response.data || response
    } catch (e: any) {
      error.value = 'Failed to load product'
      console.error(e)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
  }
})
