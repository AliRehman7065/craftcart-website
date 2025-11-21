import mongoose from 'mongoose'

const MONGO_URI = 'mongodb+srv://alirehman70612_db_user:RO1suNXa1mvTYnUN@cluster0.m8gmkq6.mongodb.net/test'

async function removeDuplicates() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ MongoDB connected successfully')

    const db = mongoose.connection.db
    const productsCollection = db.collection('products')

    // Find duplicates based on title and sellerId
    const duplicates = await productsCollection.aggregate([
      {
        $group: {
          _id: { title: '$title', sellerId: '$sellerId' },
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray()

    console.log(`\n📊 Found ${duplicates.length} sets of duplicates`)

    let totalRemoved = 0

    for (const duplicate of duplicates) {
      // Keep the first one, delete the rest
      const idsToDelete = duplicate.ids.slice(1)
      
      if (idsToDelete.length > 0) {
        const result = await productsCollection.deleteMany({
          _id: { $in: idsToDelete }
        })
        
        totalRemoved += result.deletedCount
        console.log(`🗑️  Removed ${result.deletedCount} duplicates of "${duplicate._id.title}"`)
      }
    }

    console.log(`\n✅ Total duplicates removed: ${totalRemoved}`)

    // Show remaining products count by category
    const remaining = await productsCollection.aggregate([
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

    console.log('\n📊 Remaining products by category:')
    remaining.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} products`)
    })

    await mongoose.connection.close()
    console.log('\n✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

removeDuplicates()
