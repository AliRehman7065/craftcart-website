# CraftCart - Artisan Marketplace Platform

![CraftCart Banner](https://img.shields.io/badge/CraftCart-Empowering%20Artisans-orange?style=for-the-badge)
![Nuxt 4](https://img.shields.io/badge/Nuxt-4.2-00DC82?style=flat&logo=nuxt.js)
![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vue.js)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=flat&logo=mongodb)

**CraftCart** is a full-stack marketplace platform connecting skilled Indian artisans with customers across India. Built with Nuxt 4, Vue 3, and MongoDB, it empowers traditional craftspeople to showcase and sell their handcrafted products while supporting SDG 8 (Decent Work and Economic Growth).

## 🌟 Features

### ✅ Completed Features

#### Authentication & User Management
- ✅ **Dual Account System**: Separate seller and customer roles
- ✅ **JWT Authentication**: Secure httpOnly cookie-based auth
- ✅ **Password Security**: bcrypt hashing with salt rounds
- ✅ **Auth Persistence**: Automatic session management across page reloads
- ✅ **Protected Routes**: Middleware-based route protection

#### Product Management
- ✅ **Full CRUD Operations**: Create, Read, Update, Delete products
- ✅ **8 Product Categories**: Handicrafts, Textiles, Pottery, Jewelry, Home Decor, Paintings, Woodwork, Metalwork
- ✅ **Multi-Image Support**: 2-3 images per product
- ✅ **Stock Management**: Real-time inventory tracking
- ✅ **Product Filtering**: Category, price range, search functionality
- ✅ **Duplicate Prevention**: Automatic detection and prevention of duplicate products per seller
- ✅ **58 Seeded Products**: Pre-populated catalog for testing

#### Shopping Experience
- ✅ **Shopping Cart**: Add/remove products, quantity management
- ✅ **Checkout System**: Full checkout flow with delivery address
- ✅ **Product Discovery**: Browse by category with visual cards
- ✅ **Search & Filter**: Advanced product filtering
- ✅ **Responsive Design**: Mobile-first UI with Tailwind CSS

#### Order Management
- ✅ **Order Creation**: Automated order number generation (ORD-timestamp-random)
- ✅ **Order Tracking**: Customer order history with status timeline
- ✅ **Seller Dashboard**: Real-time order management and analytics
- ✅ **Order Status Flow**: pending → confirmed → shipped → delivered (+ cancelled)
- ✅ **Stock Restoration**: Automatic stock restoration on order cancellation
- ✅ **Order Statistics**: Total orders, revenue, status breakdown

#### Seller Features
- ✅ **Seller Dashboard**: Comprehensive analytics and insights
- ✅ **Product Management**: Add, edit, delete products
- ✅ **Order Management**: View, confirm, update order status
- ✅ **Analytics**: Top selling products, recent orders, completion rate
- ✅ **Revenue Tracking**: Real-time revenue calculation (excluding cancelled orders)
- ✅ **Help Center**: Complete seller documentation and guides

#### Pages & Documentation
- ✅ **Home Page**: Dynamic product display with categories
- ✅ **About Page**: Mission, story, and values
- ✅ **Contact Page**: Contact form and information
- ✅ **FAQ Page**: Searchable knowledge base with categories
- ✅ **Terms & Conditions**: Complete legal documentation
- ✅ **Privacy Policy**: Comprehensive privacy information
- ✅ **Seller Help**: Detailed seller onboarding and guides

#### Technical Features
- ✅ **Toast Notifications**: User feedback for all actions
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Loading States**: Smooth loading experiences
- ✅ **Data Validation**: Client and server-side validation
- ✅ **Database Scripts**: Utilities for seeding, cleanup, and maintenance

### 🔄 Coming Soon (Phase 2)
- 🔄 Payment Integration (Razorpay)
- 🔄 Rating & Review System
- 🔄 Real-time Chat between buyers and sellers
- 🔄 Email Notifications
- 🔄 Image Upload with Cloud Storage
- 🔄 Advanced Analytics Dashboard

## 🚀 Tech Stack

### Frontend
- **Framework**: Nuxt 4 (Vue 3 with Composition API)
- **UI Library**: Nuxt UI (Tailwind CSS)
- **State Management**: Pinia
- **Icons**: Heroicons
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Nitro (Nuxt Server)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with httpOnly cookies
- **Password Hashing**: bcryptjs

### DevOps & Deployment
- **Package Manager**: npm
- **Version Control**: Git & GitHub
- **Deployment**: Vercel-ready configuration
- **Database Hosting**: MongoDB Atlas (recommended)

## 📦 Installation

### Prerequisites
```bash
node >= 20.0.0
npm >= 9.0.0
MongoDB >= 5.0 (local or Atlas)
```

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Black-Lights/craftcart-website.git
cd craftcart-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/craftcart
# or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/craftcart

# JWT Secret (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Optional: Firebase & Razorpay (for future features)
FIREBASE_API_KEY=
RAZORPAY_KEY_ID=
```

4. **Start MongoDB** (if using local)
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

5. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 🏗️ Project Structure

```
craftcart-website/
├── app.vue                     # Root component
├── pages/
│   ├── index.vue              # Dynamic homepage with categories
│   ├── about.vue              # About page
│   ├── contact.vue            # Contact form page
│   ├── faq.vue                # FAQ with search
│   ├── terms.vue              # Terms & conditions
│   ├── privacy.vue            # Privacy policy
│   ├── products/
│   │   ├── index.vue          # Product listing with filters
│   │   └── [id].vue           # Product detail page
│   ├── cart.vue               # Shopping cart
│   ├── checkout.vue           # Checkout page
│   ├── order-success/[id].vue # Order confirmation
│   ├── customer/
│   │   └── orders.vue         # Customer order tracking
│   └── seller/
│       ├── dashboard.vue      # Seller analytics dashboard
│       ├── products.vue       # Seller product management
│       ├── orders.vue         # Seller order management
│       └── help.vue           # Seller help center
├── components/
│   ├── AppButton.vue          # Reusable button
│   ├── AppCard.vue            # Card component
│   ├── ProductCard.vue        # Product display card
│   ├── Header.vue             # Navigation header
│   └── Toast.vue              # Toast notifications
├── layouts/
│   └── default.vue            # Main layout with header/footer
├── middleware/
│   └── auth.ts                # Route protection middleware
├── server/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── register.post.ts
│   │   │   ├── login.post.ts
│   │   │   ├── logout.post.ts
│   │   │   └── me.get.ts
│   │   ├── products/          # Product CRUD endpoints
│   │   │   ├── index.get.ts   # List products with filters
│   │   │   ├── create.post.ts # Create product (with duplicate check)
│   │   │   ├── [id].get.ts    # Get single product
│   │   │   ├── [id].put.ts    # Update product
│   │   │   ├── [id].delete.ts # Delete product
│   │   │   └── seller/
│   │   │       └── my-products.get.ts
│   │   ├── orders/            # Order management
│   │   │   ├── create.post.ts # Create order
│   │   │   ├── my-orders.get.ts # Customer orders
│   │   │   ├── [id]/status.patch.ts # Update order status
│   │   │   └── seller/
│   │   │       └── my-orders.get.ts
│   │   └── cart/              # Cart operations
│   ├── models/
│   │   ├── User.ts            # User schema with password hashing
│   │   ├── Product.ts         # Product schema
│   │   └── Order.ts           # Order schema with status workflow
│   ├── middleware/
│   │   └── auth.ts            # JWT verification
│   └── plugins/
│       └── mongoose.ts        # MongoDB connection
├── stores/
│   ├── authStore.ts           # Auth state management
│   ├── productStore.ts        # Product state
│   ├── cartStore.ts           # Cart management
│   └── toastStore.ts          # Toast notifications
├── plugins/
│   └── auth.client.ts         # Auth persistence plugin
├── scripts/
│   ├── seed-more-products.mjs # Seed 58 products
│   ├── remove-duplicates.mjs  # Clean duplicate products
│   └── fix-categories.mjs     # Fix category names
├── nuxt.config.ts             # Nuxt configuration
├── tailwind.config.ts         # Tailwind CSS config
└── package.json               # Dependencies
```

## 🎨 Key Concepts

### Authentication Flow
1. User registers/logs in via `/auth/login` or `/auth/register`
2. Server validates credentials and generates JWT
3. JWT stored in httpOnly cookie (secure, prevents XSS)
4. Middleware verifies JWT on protected routes
5. User info available in `authStore` (Pinia)

### Product Management
- **Sellers** can create products via API
- **Customers** can browse all products
- Products support categories, images, pricing, stock
- Search and filter by category, price range

### Database Models
- **User**: name, email, phone, password (hashed), userType (seller/customer)
- **Product**: title, description, price, category, images, stock, seller reference
- **Order**: customer, seller, product references, delivery address, status (coming soon)

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site

# Code Quality
npm run lint         # Run ESLint (if configured)
npm run typecheck    # Type check TypeScript
```

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/register         # Register new user (customer/seller)
POST /api/auth/login            # Login with email & password
POST /api/auth/logout           # Clear auth session
GET  /api/auth/me               # Get authenticated user info
```

### Products
```
GET    /api/products                    # List all products (with filters)
       Query params: category, minPrice, maxPrice, search, sortBy, page, limit
GET    /api/products/[id]               # Get single product details
POST   /api/products/create             # Create product (sellers only)
       - Checks for duplicate titles per seller
PUT    /api/products/[id]               # Update product (owner only)
       - Prevents duplicate title changes
DELETE /api/products/[id]               # Delete product (owner only)
GET    /api/products/seller/my-products # Get seller's products
```

### Orders
```
POST  /api/orders/create              # Create new order
      - Generates unique order number
      - Reduces product stock
GET   /api/orders/my-orders            # Get customer's orders
GET   /api/orders/seller/my-orders    # Get seller's orders
PATCH /api/orders/[id]/status         # Update order status
      - Restores stock on cancellation
```

### Cart
```
GET    /api/cart         # Get cart items (stored in localStorage client-side)
POST   /api/cart/add     # Add to cart
DELETE /api/cart/remove  # Remove from cart
```

## 🎯 Roadmap

### Phase 1: MVP Foundation ✅ (COMPLETED)
- [x] Project setup with Nuxt 4
- [x] Authentication system with JWT
- [x] Product CRUD APIs
- [x] User models (Customer & Seller)
- [x] Database setup with MongoDB Atlas

### Phase 2: Core Features ✅ (COMPLETED)
- [x] Product listing page with filters
- [x] Product detail page
- [x] Shopping cart functionality
- [x] Checkout system
- [x] Order creation API
- [x] Customer dashboard with order tracking
- [x] Order management system
- [x] Seller product management
- [x] Stock management with auto-restore

### Phase 3: Advanced Features ✅ (COMPLETED)
- [x] Seller dashboard with real-time analytics
- [x] Top selling products tracking
- [x] Revenue and order statistics
- [x] Order status workflow (5 states)
- [x] Home page with dynamic content
- [x] 8 product categories with images
- [x] 58 seeded products across categories
- [x] Duplicate product prevention
- [x] About, Contact, FAQ pages
- [x] Terms, Privacy, Help Center pages

### Phase 4: Enhancements 🔄 (IN PROGRESS)
- [x] Comprehensive documentation
- [x] Database maintenance scripts
- [ ] Payment integration (Razorpay)
- [ ] Email notifications
- [ ] Rating & review system
- [ ] Real-time chat system
- [ ] Image upload functionality
- [ ] Performance optimization
- [ ] SEO optimization

### Phase 5: Launch 🚀 (UPCOMING)
- [ ] Security audit
- [ ] Load testing
- [ ] Production deployment to Vercel
- [ ] Domain setup
- [ ] Monitoring & analytics
- [ ] User feedback collection

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub** (already done!)

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Environment Variables** (Add in Vercel dashboard)
```
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-secret
```

4. **Deploy!**
   - Vercel will auto-build and deploy
   - Every push to `main` triggers new deployment

### Database Setup (MongoDB Atlas)
1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
4. Get connection string
5. Add to Vercel environment variables

## 🤝 Contributing

This is a learning/portfolio project. Feel free to:
- Report bugs via GitHub Issues
- Suggest features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Built by **Ali** as part of SDG 8 initiative to support artisan communities.

## 🙏 Acknowledgments

- Inspired by OLX and other marketplace platforms
- Built following Nuxt 3 and Vue 3 best practices
- UI components from Nuxt UI library

---

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for Indian artisans
