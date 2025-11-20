import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  
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
