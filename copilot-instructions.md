# GitHub Copilot Instructions for Artisan Marketplace Platform

## Project Overview

**Project Name:** Artisan Marketplace  
**Type:** Full-stack web application (OLX-like marketplace for Indian artisans)  
**Goal:** Connect local artisans with customers across India, enabling economic growth (SDG 8)  
**Development Approach:** MVP-first with incremental feature releases  

### Core Functionality
- Dual account system (Seller & Customer)
- Product listing and discovery
- Real-time seller-customer chat with bargaining
- Order management and payment processing
- Delivery partner assignment
- Rating and review system

---

## Tech Stack

### Frontend
- **Framework:** Nuxt 3 (latest stable version)
- **UI Framework:** Vue 3 with Composition API + `<script setup>` syntax
- **Styling:** Tailwind CSS v3+ with Nuxt UI component library
- **State Management:** Pinia stores
- **TypeScript:** Strict mode enabled
- **Icons:** Heroicons or Lucide Icons

### Backend
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with httpOnly cookies
- **File Storage:** Firebase Cloud Storage
- **Real-time:** Firebase Realtime Database (chat)
- **Payment:** Razorpay integration

### DevOps & Tools
- **Package Manager:** pnpm (preferred) or npm
- **Linting:** ESLint with Vue and TypeScript plugins
- **Formatting:** Prettier
- **Version Control:** Git with conventional commits
- **Deployment:** Vercel (frontend) + Railway/Render (backend)

---

## Project Structure & File Organization

```
artisan-marketplace/
├── pages/                          # File-based routing (Nuxt)
│   ├── index.vue                  # Homepage (product discovery)
│   ├── auth/
│   │   ├── login.vue
│   │   └── register.vue
│   ├── products/
│   │   ├── index.vue              # Product listing
│   │   ├── [id].vue               # Product detail page
│   │   └── create.vue             # Seller product upload
│   ├── seller/
│   │   └── dashboard.vue          # Seller dashboard
│   ├── customer/
│   │   └── dashboard.vue          # Customer dashboard
│   └── chat/
│       └── [orderId].vue          # Chat interface
│
├── components/                     # Reusable Vue components
│   ├── common/                    # Shared components
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── ProductCard.vue
│   │   └── RatingStars.vue
│   ├── seller/                    # Seller-specific components
│   │   ├── ProductUploadForm.vue
│   │   └── OrderManagement.vue
│   └── customer/                  # Customer-specific components
│       ├── OrderHistory.vue
│       └── CartSummary.vue
│
├── composables/                    # Composition API reusable logic
│   ├── useAuth.ts                 # Authentication logic
│   ├── useProducts.ts             # Product operations
│   ├── useOrders.ts               # Order management
│   ├── useChat.ts                 # Real-time chat
│   └── usePayment.ts              # Payment processing
│
├── stores/                         # Pinia state stores
│   ├── authStore.ts               # User authentication state
│   ├── productStore.ts            # Products catalog
│   ├── orderStore.ts              # Order management
│   └── chatStore.ts               # Chat messages
│
├── server/                         # Nuxt server routes (API)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   └── register.post.ts
│   │   ├── products/
│   │   │   ├── index.get.ts
│   │   │   ├── [id].get.ts
│   │   │   └── create.post.ts
│   │   ├── orders/
│   │   └── users/
│   └── middleware/
│       ├── auth.ts                # JWT verification
│       └── errorHandler.ts
│
├── types/                          # TypeScript type definitions
│   ├── user.ts
│   ├── product.ts
│   ├── order.ts
│   └── api.ts
│
├── assets/                         # Static assets
│   ├── css/
│   │   └── main.css               # Tailwind imports
│   └── images/
│
├── layouts/                        # Nuxt layouts
│   ├── default.vue                # Default layout (header + footer)
│   └── dashboard.vue              # Dashboard layout
│
├── public/                         # Public static files
│
├── utils/                          # Utility functions
│   ├── validation.ts
│   ├── formatters.ts
│   └── constants.ts
│
├── .github/
│   └── copilot-instructions.md    # This file
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
└── package.json
```

---

## Coding Guidelines & Best Practices

### Vue 3 Component Structure

**Always use this order in `<script setup>` sections:**

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import type { Product } from '~/types/product'

// 2. Props & Emits
interface Props {
  productId: string
  initialData?: Product
}

const props = defineProps<Props>()
const emit = defineEmits<{
  save: [product: Product]
  cancel: []
}>()

// 3. Composables
const { user } = useAuth()
const { products, fetchProducts } = useProducts()

// 4. Reactive state (refs)
const loading = ref(false)
const errorMessage = ref('')

// 5. Computed properties
const isValid = computed(() => {
  return product.value.title.length > 0 && product.value.price > 0
})

// 6. Methods/Functions
const handleSubmit = async () => {
  loading.value = true
  // ... implementation
  loading.value = false
}

// 7. Lifecycle hooks
onMounted(async () => {
  await fetchProducts()
})
</script>

<template>
  <!-- Template here -->
</template>

<style scoped>
/* Component-specific styles if needed */
</style>
```

### Component Naming Conventions

- **Components:** PascalCase with multi-word names (`ProductCard.vue`, `UserProfile.vue`)
- **Pages:** lowercase with hyphens or PascalCase (`index.vue`, `product-detail.vue`)
- **Composables:** camelCase with `use` prefix (`useAuth.ts`, `useProducts.ts`)
- **Stores:** camelCase with `Store` suffix (`authStore.ts`, `productStore.ts`)
- **Types:** PascalCase (`User.ts`, `Product.ts`)

### TypeScript Requirements

- **Always use TypeScript** for all `.ts` and `.vue` files
- **Explicitly type function parameters** and return values
- **Use interfaces for objects**, types for unions/intersections
- **Avoid `any` type** - use `unknown` if type is truly unknown
- **Enable strict mode** in tsconfig.json

**Example:**
```typescript
// ✅ Good
interface CreateProductDTO {
  title: string
  price: number
  description: string
  images: string[]
}

const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  // implementation
}

// ❌ Bad
const createProduct = async (data: any) => {
  // implementation
}
```

### Tailwind CSS & Styling

- **Use Tailwind utility classes** directly in templates
- **Extract repeated patterns** into components, not custom CSS
- **Use `@apply` sparingly** - only for base styles in main.css
- **Responsive design:** Mobile-first approach (`sm:`, `md:`, `lg:`, `xl:`)
- **Dark mode:** Use `dark:` prefix for dark mode variants when needed

**Example:**
```vue
<template>
  <!-- ✅ Good: Direct utility classes -->
  <button 
    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
    :disabled="loading"
  >
    Submit
  </button>

  <!-- ❌ Avoid: Custom CSS classes for one-off styles -->
  <button class="custom-button">Submit</button>
</template>
```

### Nuxt UI Component Library Usage

- **Prefer Nuxt UI components** for common patterns (buttons, inputs, modals, cards)
- **Customize through `app.config.ts`** for global theme changes
- **Use slots and variants** for component flexibility

**Example:**
```vue
<template>
  <UButton 
    color="primary" 
    variant="solid" 
    size="md"
    :loading="isSubmitting"
    @click="handleSubmit"
  >
    Save Product
  </UButton>

  <UInput 
    v-model="productTitle" 
    placeholder="Enter product title"
    :error="errors.title"
  />
</template>
```

---

## State Management with Pinia

### Store Structure

```typescript
// stores/productStore.ts
import { defineStore } from 'pinia'
import type { Product } from '~/types/product'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters (computed)
  const featuredProducts = computed(() => {
    return products.value.filter(p => p.featured)
  })

  // Actions (methods)
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Product[]>('/api/products')
      products.value = data
    } catch (e) {
      error.value = 'Failed to fetch products'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    products,
    loading,
    error,
    // Getters
    featuredProducts,
    // Actions
    fetchProducts,
  }
})
```

### Using Stores in Components

```vue
<script setup lang="ts">
const productStore = useProductStore()
const { products, loading } = storeToRefs(productStore)

onMounted(() => {
  productStore.fetchProducts()
})
</script>
```

---

## API Routes & Backend Patterns

### Express-style API Routes in Nuxt Server

```typescript
// server/api/products/index.get.ts
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { category, minPrice, maxPrice } = query

    // Build MongoDB query
    const filter: any = {}
    if (category) filter.category = category
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })

    return {
      success: true,
      data: products,
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch products',
    })
  }
})
```

### Authentication Middleware

```typescript
// server/middleware/auth.ts
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // Skip auth for public routes
  const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/products']
  if (publicRoutes.some(route => event.path.startsWith(route))) {
    return
  }

  const token = getCookie(event, 'auth_token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    event.context.user = decoded
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token',
    })
  }
})
```

---

## Database Models (Mongoose)

### Example: Product Schema

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
    enum: ['handicrafts', 'textiles', 'pottery', 'jewelry', 'home-decor'],
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
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
})

// Indexes for performance
productSchema.index({ sellerId: 1 })
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })

export const Product = mongoose.model('Product', productSchema)
```

---

## Real-time Chat Implementation

### Firebase Realtime Database Structure

```typescript
// composables/useChat.ts
import { ref, onMounted, onUnmounted } from 'vue'
import { getDatabase, ref as dbRef, onValue, push, set } from 'firebase/database'

export const useChat = (orderId: string) => {
  const messages = ref<ChatMessage[]>([])
  const loading = ref(true)
  
  let unsubscribe: (() => void) | null = null

  const sendMessage = async (text: string, senderId: string) => {
    const db = getDatabase()
    const messagesRef = dbRef(db, `chats/${orderId}/messages`)
    
    const newMessageRef = push(messagesRef)
    await set(newMessageRef, {
      text,
      senderId,
      timestamp: Date.now(),
      isRead: false,
    })
  }

  const subscribeToMessages = () => {
    const db = getDatabase()
    const messagesRef = dbRef(db, `chats/${orderId}/messages`)
    
    unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      messages.value = data ? Object.values(data) : []
      loading.value = false
    })
  }

  onMounted(() => {
    subscribeToMessages()
  })

  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })

  return {
    messages,
    loading,
    sendMessage,
  }
}
```

---

## Error Handling

### Frontend Error Handling

```typescript
// Use try-catch with user-friendly error messages
const handleLogin = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    await authStore.login(credentials.value)
    await navigateTo('/dashboard')
  } catch (error: any) {
    // Display user-friendly error
    errorMessage.value = error?.data?.message || 'Login failed. Please try again.'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
```

### Backend Error Handling

```typescript
// server/utils/errorHandler.ts
export const handleError = (error: unknown, customMessage?: string) => {
  console.error('Error:', error)
  
  const message = customMessage || 'An unexpected error occurred'
  const statusCode = error instanceof Error && 'statusCode' in error 
    ? (error as any).statusCode 
    : 500

  throw createError({
    statusCode,
    message,
  })
}
```

---

## Testing Guidelines

### Unit Tests (Vitest)

```typescript
// components/__tests__/ProductCard.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '../ProductCard.vue'

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const product = {
      id: '1',
      title: 'Handmade Pottery',
      price: 500,
      images: ['image1.jpg'],
    }

    const wrapper = mount(ProductCard, {
      props: { product },
    })

    expect(wrapper.text()).toContain('Handmade Pottery')
    expect(wrapper.text()).toContain('₹500')
  })
})
```

---

## Environment Variables

### Required Environment Variables

```bash
# .env.example

# Database
MONGODB_URI=mongodb://localhost:27017/artisan-marketplace
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Base URLs
NUXT_PUBLIC_API_BASE=/api
```

---

## Git Workflow & Commit Conventions

### Commit Message Format (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (not CSS)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add seller registration with KYC verification
fix(chat): resolve real-time message sync issue
docs(readme): update installation instructions
refactor(products): optimize product search query
```

---

## Performance Optimization

### Lazy Loading Components

```vue
<script setup lang="ts">
// Lazy load heavy components
const ChatInterface = defineAsyncComponent(() => 
  import('~/components/chat/ChatInterface.vue')
)
</script>
```

### Image Optimization

```vue
<template>
  <!-- Use Nuxt Image for automatic optimization -->
  <NuxtImg 
    :src="product.image" 
    :alt="product.title"
    width="400"
    height="300"
    format="webp"
    loading="lazy"
  />
</template>
```

### API Response Caching

```typescript
// Use useFetch with caching
const { data: products } = await useFetch('/api/products', {
  key: 'products-list',
  getCachedData: (key) => useNuxtData(key).data.value,
})
```

---

## Security Best Practices

1. **Never commit sensitive data** (API keys, secrets) to Git
2. **Sanitize user inputs** before database operations
3. **Use parameterized queries** to prevent NoSQL injection
4. **Implement rate limiting** on API endpoints
5. **Validate file uploads** (type, size) before storage
6. **Use HTTPS only** in production
7. **Set secure httpOnly cookies** for JWT tokens
8. **Implement CSRF protection** for state-changing operations

---

## Deployment Checklist

### Before Deployment

- [ ] Run `npm run build` successfully
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificates configured
- [ ] Error tracking setup (Sentry)
- [ ] Performance monitoring enabled
- [ ] SEO meta tags configured
- [ ] Security headers configured

### Vercel (Frontend)

```bash
# Build command
npm run build

# Output directory
.output/public

# Environment variables
Add all NUXT_PUBLIC_* variables
```

### Railway/Render (Backend)

```bash
# Start command
npm run start

# Health check endpoint
/api/health
```

---

## Common Patterns & Snippets

### Form Validation Pattern

```typescript
// composables/useFormValidation.ts
export const useFormValidation = <T extends Record<string, any>>(
  initialState: T
) => {
  const formData = ref<T>(initialState)
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const isValid = computed(() => Object.keys(errors.value).length === 0)

  const validate = (rules: Record<keyof T, (value: any) => string | null>) => {
    errors.value = {}
    
    for (const [field, rule] of Object.entries(rules)) {
      const error = rule(formData.value[field as keyof T])
      if (error) {
        errors.value[field as keyof T] = error
      }
    }

    return isValid.value
  }

  return {
    formData,
    errors,
    isValid,
    validate,
  }
}
```

### Loading State Pattern

```vue
<script setup lang="ts">
const { loading, execute } = useAsyncState(async () => {
  return await fetchData()
}, null, { immediate: false })
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>Content</div>
</template>
```

---

## Resources & Documentation

- **Nuxt 3 Docs:** https://nuxt.com/docs
- **Vue 3 Docs:** https://vuejs.org/guide
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Nuxt UI:** https://ui.nuxt.com
- **Pinia:** https://pinia.vuejs.org
- **Firebase:** https://firebase.google.com/docs
- **Mongoose:** https://mongoosejs.com/docs

---

## AI Assistant Instructions

When generating code for this project:

1. **Always use TypeScript** with proper type annotations
2. **Follow the Composition API** with `<script setup>` syntax
3. **Use Nuxt 3 auto-imports** (no need to import ref, computed, etc.)
4. **Prefer Nuxt UI components** over custom implementations
5. **Write responsive, mobile-first** Tailwind classes
6. **Include error handling** in all async operations
7. **Add JSDoc comments** for complex functions
8. **Consider performance** (lazy loading, code splitting)
9. **Follow the established project structure** shown above
10. **Write clean, maintainable code** with clear variable names

### When Asked to Create:

- **Components:** Use PascalCase, include props typing, emit events properly
- **Composables:** Return reactive state and methods, handle cleanup
- **API Routes:** Include validation, error handling, proper HTTP status codes
- **Stores:** Use setup store syntax (function-based), include getters/actions
- **Types:** Create comprehensive interfaces with JSDoc descriptions

---

## Quick Command Reference

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run preview          # Preview production build
npm run generate         # Generate static site

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run typecheck        # Check TypeScript types

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

---

**Last Updated:** 2025-11-15  
**Nuxt Version:** 3.x (latest stable)  
**Node Version:** 20+
