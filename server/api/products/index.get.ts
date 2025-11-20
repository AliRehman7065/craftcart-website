import { Product } from '~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
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

    // Transform data for frontend
    const transformedProducts = products.map((product: any) => ({
      id: product._id.toString(),
      sellerId: product.sellerId._id.toString(),
      seller: {
        name: product.sellerId.name,
        rating: product.sellerId.rating,
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
    }))

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
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch products',
    })
  }
})
