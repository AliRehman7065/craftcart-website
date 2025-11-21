import { Product } from '../../models/Product'

export default defineEventHandler(async (event) => {
  try {
    // Check database connection
    const mongoose = await import('mongoose')
    if (mongoose.default.connection.readyState !== 1) {
      console.error('Database not connected. State:', mongoose.default.connection.readyState)
      throw createError({
        statusCode: 503,
        message: 'Database connection not available',
      })
    }

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

    // Execute query with population
    const products = await Product
      .find(filter)
      .populate('sellerId', 'name rating location')
      .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean()

    const total = await Product.countDocuments(filter)

    // Manually populate seller field if it exists (for old data)
    const User = (await import('../../models/User')).User
    const productsWithSeller = await Promise.all(
      products.map(async (product: any) => {
        let sellerData = product.sellerId
        
        // If no sellerId but has seller field (ObjectId), fetch it
        if (!sellerData && product.seller) {
          sellerData = await User.findById(product.seller).select('name rating location').lean()
        }
        
        return {
          ...product,
          sellerData
        }
      })
    )

    // Transform data for frontend
    const transformedProducts = productsWithSeller.map((product: any) => {
      const sellerData = product.sellerData
      
      return {
        _id: product._id.toString(),
        seller: sellerData ? {
          _id: sellerData._id?.toString() || sellerData.toString(),
          name: sellerData.name || 'Unknown',
          rating: sellerData.rating || { average: 0, count: 0 },
        } : {
          _id: '',
          name: 'Unknown',
          rating: { average: 0, count: 0 },
        },
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images,
        stock: product.stock,
        location: product.location,
        rating: product.rating,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }
    })

    return {
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    }
  } catch (error: any) {
    console.error('Fetch products error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    
    throw createError({
      statusCode: 500,
      message: `Failed to fetch products: ${error.message}`,
    })
  }
})
