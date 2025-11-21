import mongoose from 'mongoose'
import 'dotenv/config'

const MONGO_URI = process.env.MONGODB_URI

if (!MONGO_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables')
  process.exit(1)
}

async function fixCategories() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ MongoDB connected successfully')

    const db = mongoose.connection.db
    const productsCollection = db.collection('products')

    // Capitalize category names
    const categoryMappings = {
      'home decor': 'Home Decor',
      'jewelry': 'Jewelry',
      'metalwork': 'Metalwork',
      'pottery': 'Pottery',
      'textiles': 'Textiles',
      'woodwork': 'Woodwork',
      'handicrafts': 'Handicrafts',
      'paintings': 'Paintings'
    }

    let totalUpdated = 0

    for (const [lowercase, capitalized] of Object.entries(categoryMappings)) {
      const result = await productsCollection.updateMany(
        { category: lowercase },
        { $set: { category: capitalized } }
      )
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${result.modifiedCount} products from "${lowercase}" to "${capitalized}"`)
        totalUpdated += result.modifiedCount
      }
    }

    console.log(`\n✅ Total products updated: ${totalUpdated}`)

    // Show products count by category
    const categoryStats = await productsCollection.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray()

    console.log('\n📊 Products by category:')
    categoryStats.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} products`)
    })

    await mongoose.connection.close()
    console.log('\n✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

fixCategories()
