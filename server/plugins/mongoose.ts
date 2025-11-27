import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  
  // Skip if no MongoDB URI configured
  if (!config.mongodbUri || config.mongodbUri === '') {
    console.error('❌ MONGODB_URI environment variable is not set!')
    console.log('💡 Please set MONGODB_URI in your environment variables')
    console.log('💡 For Vercel: Add it in Project Settings → Environment Variables')
    return
  }

  console.log('🔄 Attempting to connect to MongoDB...')
  console.log('📍 Environment:', process.env.NODE_ENV || 'development')

  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected')
      return
    }

    // Connection options
    const options = {
      serverSelectionTimeoutMS: 10000, // Increased for Vercel
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      compressors: ['zlib'],
    }

    await mongoose.connect(config.mongodbUri, options)
    
    console.log('✅ MongoDB connected successfully')
    console.log(`📊 Database: ${mongoose.connection.name}`)
    console.log(`🔗 Connection state: ${mongoose.connection.readyState}`)
    
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message)
    console.error('📋 Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName,
    })
    console.log('💡 Make sure your MongoDB connection string is correct')
    console.log('💡 For MongoDB Atlas: Ensure IP whitelist includes 0.0.0.0/0')
    console.log('💡 For Vercel deployment: Check environment variables are set')
    
    // Don't exit process - let it fail gracefully
    // if (process.env.NODE_ENV === 'production') {
    //   process.exit(1)
    // }
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
