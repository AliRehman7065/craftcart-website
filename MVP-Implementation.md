# MVP Implementation Guide: Artisan Marketplace with Vue 3 + Nuxt 3

## Quick Start Setup

### Prerequisites
```bash
# Ensure you have Node.js 20+ installed
node --version  # Should be v20 or higher

# Install pnpm (recommended) or use npm
npm install -g pnpm
```

### Project Initialization

```bash
# Create new Nuxt 3 project with TypeScript
npx nuxi@latest init artisan-marketplace

cd artisan-marketplace

# Install dependencies
pnpm install

# Install required packages
pnpm add -D @nuxtjs/tailwindcss
pnpm add @nuxt/ui
pnpm add pinia @pinia/nuxt
pnpm add mongoose
pnpm add jsonwebtoken bcryptjs
pnpm add firebase
pnpm add razorpay

# Install dev dependencies
pnpm add -D @types/jsonwebtoken @types/bcryptjs
pnpm add -D vitest @vue/test-utils
```

### Configure nuxt.config.ts

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private keys (server-side only)
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
    
    public: {
      // Public keys (client-side accessible)
      apiBase: '/api',
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  nitro: {
    plugins: ['~/server/plugins/mongoose.ts'],
  },
})
```

---

## Phase 1: MVP Foundation (Week 1-2)

### Day 1-2: Project Setup & Authentication Backend

#### 1. Create Database Models

```typescript
// server/models/User.ts
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  userType: {
    type: String,
    enum: ['seller', 'customer'],
    required: true,
  },
  profileImage: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model('User', userSchema)
```

#### 2. Setup MongoDB Connection

```typescript
// server/plugins/mongoose.ts
import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  
  try {
    await mongoose.connect(config.mongodbUri)
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
})
```

#### 3. Create Authentication API Routes

```typescript
// server/api/auth/register.post.ts
import { User } from '~/server/models/User'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, phone, password, userType } = body

    // Validation
    if (!name || !email || !phone || !password || !userType) {
      throw createError({
        statusCode: 400,
        message: 'All fields are required',
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'User already exists with this email',
      })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      userType,
    })

    // Generate JWT token
    const config = useRuntimeConfig()
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    // Set httpOnly cookie
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        },
      },
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    throw error
  }
})
```

```typescript
// server/api/auth/login.post.ts
import { User } from '~/server/models/User'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required',
      })
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials',
      })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials',
      })
    }

    // Generate JWT token
    const config = useRuntimeConfig()
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        },
      },
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw error
  }
})
```

### Day 3-4: Frontend Authentication

#### 1. Create Auth Store

```typescript
// stores/authStore.ts
import { defineStore } from 'pinia'
import type { User } from '~/types/user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isSeller = computed(() => user.value?.userType === 'seller')
  const isCustomer = computed(() => user.value?.userType === 'customer')

  const login = async (credentials: { email: string; password: string }) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })

      user.value = data.user
      navigateTo('/')
    } catch (e: any) {
      error.value = e?.data?.message || 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: any) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await $fetch('/api/auth/register', {
        method: 'POST',
        body: userData,
      })

      user.value = data.user
      navigateTo('/')
    } catch (e: any) {
      error.value = e?.data?.message || 'Registration failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/auth/login')
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isSeller,
    isCustomer,
    login,
    register,
    logout,
  }
})
```

#### 2. Create Login Page

```vue
<!-- pages/auth/login.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

const credentials = ref({
  email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    await authStore.login(credentials.value)
  } catch (e) {
    // Error is already set in store
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Or
          <NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-500">
            create a new account
          </NuxtLink>
        </p>
      </div>

      <UForm :state="credentials" @submit="handleLogin" class="mt-8 space-y-6">
        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          :title="error"
          :close-button="{ icon: 'i-heroicons-x-mark-20-solid' }"
          @close="error = null"
        />

        <UFormGroup label="Email" name="email" required>
          <UInput
            v-model="credentials.email"
            type="email"
            placeholder="Enter your email"
            size="lg"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password" required>
          <UInput
            v-model="credentials.password"
            type="password"
            placeholder="Enter your password"
            size="lg"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          :loading="loading"
        >
          Sign in
        </UButton>
      </UForm>
    </div>
  </div>
</template>
```

### Day 5-7: Product Listing Backend

#### 1. Create Product Model

```typescript
// server/models/Product.ts
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['handicrafts', 'textiles', 'pottery', 'jewelry', 'home-decor', 'other'],
  },
  images: [{
    type: String,
    required: true,
  }],
  stock: {
    type: Number,
    default: 1,
    min: 0,
  },
  location: {
    city: String,
    state: String,
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

productSchema.index({ sellerId: 1 })
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ 'rating.average': -1 })

export const Product = mongoose.model('Product', productSchema)
```

#### 2. Product API Routes

```typescript
// server/api/products/index.get.ts
import { Product } from '~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
    } = query

    // Build filter
    const filter: any = { isActive: true }

    if (category && category !== 'all') {
      filter.category = category
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Execute query
    const products = await Product
      .find(filter)
      .populate('sellerId', 'name rating')
      .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Product.countDocuments(filter)

    return {
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch products',
    })
  }
})
```

```typescript
// server/api/products/create.post.ts
import { Product } from '~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
    // Verify user is authenticated and is a seller
    const user = event.context.user
    if (!user || user.userType !== 'seller') {
      throw createError({
        statusCode: 403,
        message: 'Only sellers can create products',
      })
    }

    const body = await readBody(event)
    const { title, description, price, category, images, stock, location } = body

    // Validation
    if (!title || !description || !price || !category || !images?.length) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields',
      })
    }

    const product = await Product.create({
      sellerId: user.userId,
      title,
      description,
      price,
      category,
      images,
      stock: stock || 1,
      location,
    })

    return {
      success: true,
      data: product,
    }
  } catch (error: any) {
    console.error('Product creation error:', error)
    throw error
  }
})
```

### Day 8-10: Product Listing Frontend

#### 1. Product Store

```typescript
// stores/productStore.ts
import { defineStore } from 'pinia'
import type { Product, ProductFilters } from '~/types/product'

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
      const { data } = await $fetch('/api/products', {
        query: filters,
      })

      products.value = data.products
      pagination.value = data.pagination
    } catch (e: any) {
      error.value = 'Failed to load products'
      console.error(e)
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
  }
})
```

#### 2. Product Listing Page

```vue
<!-- pages/products/index.vue -->
<script setup lang="ts">
const productStore = useProductStore()
const { products, loading, pagination } = storeToRefs(productStore)

const filters = ref({
  category: 'all',
  minPrice: undefined,
  maxPrice: undefined,
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
})

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'handicrafts', label: 'Handicrafts' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'pottery', label: 'Pottery' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'home-decor', label: 'Home Décor' },
]

watch(filters, () => {
  productStore.fetchProducts(filters.value)
}, { deep: true })

onMounted(() => {
  productStore.fetchProducts(filters.value)
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Filters -->
    <div class="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <UInput
        v-model="filters.search"
        placeholder="Search products..."
        icon="i-heroicons-magnifying-glass"
      />
      
      <USelectMenu
        v-model="filters.category"
        :options="categories"
        value-attribute="value"
        option-attribute="label"
      />

      <UInput
        v-model.number="filters.minPrice"
        type="number"
        placeholder="Min Price"
      />

      <UInput
        v-model.number="filters.maxPrice"
        type="number"
        placeholder="Max Price"
      />
    </div>

    <!-- Product Grid -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <USkeleton v-for="i in 8" :key="i" class="h-80 w-full" />
    </div>

    <div v-else-if="products.length === 0" class="text-center py-16">
      <p class="text-gray-500 text-lg">No products found</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Pagination -->
    <div v-if="pagination.pages > 1" class="mt-8 flex justify-center">
      <UPagination
        v-model="filters.page"
        :total="pagination.total"
        :page-count="pagination.limit"
      />
    </div>
  </div>
</template>
```

---

## Phase 2: Core Transaction Flow (Week 3-4)

### Order Model & API

```typescript
// server/models/Order.ts
import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  deliveryCharge: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  deliveryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
  },
}, {
  timestamps: true,
})

export const Order = mongoose.model('Order', orderSchema)
```

### Continue with remaining phases...

---

## Post-MVP Feature Additions

After MVP launch, add these features incrementally:

**Week 8-10: Enhanced Features**
- Advanced search with filters
- Wishlist functionality
- Bulk product upload for sellers
- Multi-image carousel
- Product recommendations

**Week 11-12: Business Features**
- Seller analytics dashboard
- Inventory management
- Promotional discounts
- Featured listings
- Newsletter integration

**Week 13-16: Scale & Optimize**
- Performance optimization
- SEO improvements
- Multi-language support
- PWA capabilities
- Advanced security features

---

## Deployment Guide

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### Backend (Railway/Render)

1. Create new project
2. Connect GitHub repository
3. Set environment variables
4. Configure health check endpoint
5. Deploy

---

**This guide provides a complete roadmap from setup to deployment. Follow each phase sequentially for best results.**
