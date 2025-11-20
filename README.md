# CraftCart - Artisan Marketplace Platform

![CraftCart Banner](https://img.shields.io/badge/CraftCart-Empowering%20Artisans-orange?style=for-the-badge)
![Nuxt 4](https://img.shields.io/badge/Nuxt-4.2-00DC82?style=flat&logo=nuxt.js)
![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vue.js)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=flat&logo=mongodb)

**CraftCart** is a full-stack marketplace platform connecting skilled Indian artisans with customers across India. Built with Nuxt 4, Vue 3, and MongoDB, it empowers traditional craftspeople to showcase and sell their handcrafted products while supporting SDG 8 (Decent Work and Economic Growth).

## 🌟 Features

### Current MVP (Phase 1)
- ✅ **Dual Account System**: Separate interfaces for Sellers and Customers
- ✅ **Authentication**: JWT-based secure authentication with bcrypt password hashing
- ✅ **Product Management**: CRUD operations for artisan products
- ✅ **Product Discovery**: Browse, search, and filter products by category, price
- ✅ **Responsive Design**: Mobile-first UI with Nuxt UI components
- ✅ **Modern Stack**: Built with latest Nuxt 4, Vue 3, TypeScript

### Coming Soon (Phase 2-4)
- 🔄 Real-time Chat with Firebase
- 🔄 Order Management & Tracking
- 🔄 Payment Integration (Razorpay)
- 🔄 Rating & Review System
- 🔄 Delivery Partner Assignment
- 🔄 Advanced Search & Filters
- 🔄 Seller Analytics Dashboard
- 🔄 Image Upload with Firebase Storage

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
├── app/
│   └── app.vue                 # Root component
├── pages/
│   ├── index.vue              # Homepage
│   ├── auth/
│   │   ├── login.vue          # Login page
│   │   └── register.vue       # Registration page
│   └── products/              # Product pages (coming soon)
├── components/                # Reusable Vue components (coming soon)
├── layouts/
│   ├── default.vue            # Main layout with header/footer
│   └── auth.vue               # Auth page layout
├── server/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   └── products/          # Product CRUD endpoints
│   ├── middleware/
│   │   └── auth.ts            # JWT verification middleware
│   ├── models/
│   │   ├── User.ts            # User MongoDB schema
│   │   ├── Product.ts         # Product MongoDB schema
│   │   └── Order.ts           # Order MongoDB schema
│   └── plugins/
│       └── mongoose.ts        # MongoDB connection
├── stores/
│   └── authStore.ts           # Pinia auth store
├── types/
│   ├── user.ts                # User type definitions
│   ├── product.ts             # Product type definitions
│   ├── order.ts               # Order type definitions
│   └── api.ts                 # API response types
├── nuxt.config.ts             # Nuxt configuration
├── app.config.ts              # Nuxt UI theme config
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
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
POST /api/auth/logout      # Logout user
GET  /api/auth/me          # Get current user
```

### Products
```
GET  /api/products              # List products (with filters)
GET  /api/products/:id          # Get single product
POST /api/products/create       # Create product (sellers only)
```

## 🎯 Roadmap

### Phase 1: MVP Foundation ✅ (Completed)
- [x] Project setup with Nuxt 4
- [x] Authentication system
- [x] Product CRUD APIs
- [x] Basic UI (Homepage, Auth pages)
- [x] Database models

### Phase 2: Core Features (Week 3-4)
- [ ] Product listing page with filters
- [ ] Product detail page
- [ ] Seller product upload form
- [ ] Order creation API
- [ ] Customer dashboard

### Phase 3: Transactions & Chat (Week 5-6)
- [ ] Firebase real-time chat
- [ ] Razorpay payment integration
- [ ] Order tracking
- [ ] Rating system

### Phase 4: Polish & Launch (Week 7-8)
- [ ] Seller dashboard with analytics
- [ ] Image upload to Firebase Storage
- [ ] Email notifications
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment to Vercel

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
