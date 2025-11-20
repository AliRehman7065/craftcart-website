import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  
  // Skip if no MongoDB URI configured
  if (!config.mongodbUri || config.mongodbUri === '') {
    console.log('⚠️  MongoDB URI not configured. Database features will not work.')
    console.log('💡 Please set MONGODB_URI in your .env file')
    return
  }

  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected')
      return
    }

    // Connection options
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    await mongoose.connect(config.mongodbUri, options)
    
    console.log('✅ MongoDB connected successfully')
    console.log(`📊 Database: ${mongoose.connection.name}`)
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    console.log('💡 Make sure your MongoDB connection string is correct in .env')
    console.log('💡 For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/craftcart')
    console.log('💡 For local MongoDB: mongodb://localhost:27017/craftcart')
    
    // Don't exit process in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }

  // Handle connection events
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected')
  })

  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err)
  })
})
