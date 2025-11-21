import mongoose from 'mongoose'

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://alirehman70612_db_user:RO1suNXa1mvTYnUN@cluster0.m8gmkq6.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0'

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  userType: String,
  profileImage: String,
  isVerified: Boolean,
  location: {
    city: String,
    state: String,
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
}, { timestamps: true })

// Product Schema
const productSchema = new mongoose.Schema({
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
  },
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

const User = mongoose.models.User || mongoose.model('User', userSchema)
const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

// Product data
const products = [
  {
    title: "Handwoven Cotton Throw Blanket",
    description: "Beautiful handwoven cotton throw blanket with traditional patterns. Made using natural dyes and sustainable cotton. Perfect for adding warmth and style to your living space. Each piece is unique and crafted with care by skilled artisans.",
    category: "textiles",
    price: 2499,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800"
    ]
  },
  {
    title: "Ceramic Pottery Vase Set",
    description: "Elegant set of 3 handcrafted ceramic vases with unique glazing. Perfect for home decor or as a gift. Each vase is individually shaped and fired, making every piece one-of-a-kind. Suitable for fresh or dried flowers.",
    category: "pottery",
    price: 1899,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"
    ]
  },
  {
    title: "Handcrafted Silver Jewelry Set",
    description: "Exquisite silver jewelry set including necklace and earrings. Features intricate traditional designs with oxidized finish. Made from 92.5% pure silver. Perfect for weddings and special occasions.",
    category: "jewelry",
    price: 3499,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"
    ]
  },
  {
    title: "Wooden Wall Art Mandala",
    description: "Stunning hand-carved wooden mandala wall art. Made from sustainable teak wood with natural finish. Intricate geometric patterns symbolizing harmony and balance. Dimensions: 24 inches diameter. Ready to hang.",
    category: "woodwork",
    price: 4999,
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800",
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800"
    ]
  },
  {
    title: "Handpainted Decorative Plates",
    description: "Set of 4 beautifully handpainted ceramic decorative plates. Features vibrant colors and traditional motifs. Can be used as wall decor or serving plates. Each plate is 10 inches in diameter. Food safe and durable.",
    category: "home decor",
    price: 1599,
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800"
    ]
  },
  {
    title: "Brass Diya Lamp Set",
    description: "Traditional brass diya lamps set of 6. Perfect for festivals and daily prayers. Hand-polished brass with intricate engravings. Includes cotton wicks. Brings divine light and positive energy to your home.",
    category: "metalwork",
    price: 899,
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800",
      "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800"
    ]
  },
  {
    title: "Madhubani Painting Canvas",
    description: "Authentic Madhubani folk art painting on canvas. Features traditional motifs of nature and mythology. Hand-painted using natural colors. Size: 16x20 inches. Comes with certificate of authenticity. Ready to frame.",
    category: "paintings",
    price: 3999,
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
      "https://images.unsplash.com/photo-1577720643272-265f75c6c12f?w=800"
    ]
  },
  {
    title: "Macrame Wall Hanging",
    description: "Boho style macrame wall hanging made from 100% cotton rope. Features intricate knotting patterns with wooden beads. Adds a rustic, cozy touch to any room. Size: 30 inches long. Easy to hang with wooden rod included.",
    category: "handicrafts",
    price: 1299,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
      "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800"
    ]
  }
]

async function seedProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Find seller user
    console.log('\n🔍 Finding seller account...')
    const seller = await User.findOne({ userType: 'seller' })
    
    if (!seller) {
      console.error('❌ No seller account found! Please create a seller account first.')
      process.exit(1)
    }
    
    console.log(`✅ Found seller: ${seller.name} (${seller.email})`)

    // Clear existing products for this seller
    console.log('\n🗑️  Clearing existing products...')
    const deleteResult = await Product.deleteMany({ seller: seller._id })
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing products`)

    // Create new products
    console.log('\n📦 Creating new products...')
    const createdProducts = []
    
    for (const productData of products) {
      const product = await Product.create({
        ...productData,
        seller: seller._id,
      })
      createdProducts.push(product)
      console.log(`  ✓ ${product.title} - ₹${product.price}`)
    }

    console.log(`\n✅ Successfully created ${createdProducts.length} products!`)
    console.log('\n🎉 Sample products with images added to your seller account!')
    console.log('🌐 View them at: http://localhost:3000/products')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

seedProducts()
