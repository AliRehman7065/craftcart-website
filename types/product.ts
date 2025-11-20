export interface Product {
  id: string
  sellerId: string
  seller?: {
    name: string
    rating: {
      average: number
      count: number
    }
  }
  title: string
  description: string
  price: number
  category: ProductCategory
  images: string[]
  stock: number
  location?: {
    city?: string
    state?: string
  }
  rating: {
    average: number
    count: number
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type ProductCategory = 
  | 'handicrafts' 
  | 'textiles' 
  | 'pottery' 
  | 'jewelry' 
  | 'home-decor' 
  | 'paintings'
  | 'woodwork'
  | 'metalwork'
  | 'other'

export interface ProductFilters {
  category?: ProductCategory | 'all'
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'createdAt' | 'price' | 'rating.average'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ProductCreateDTO {
  title: string
  description: string
  price: number
  category: ProductCategory
  images: string[]
  stock?: number
  location?: {
    city?: string
    state?: string
  }
}

export interface ProductsResponse {
  success: boolean
  data: {
    products: Product[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}
