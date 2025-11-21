import { Product } from '../../models/Product'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required',
      })
    }

    const product = await Product
      .findById(id)
      .populate('sellerId', 'name rating location phone email')
      .lean()

    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      })
    }

    // Manually populate seller field if it exists (for old data)
    let sellerData = (product as any).sellerId
    
    if (!sellerData && (product as any).seller) {
      const User = (await import('../../models/User')).User
      sellerData = await User.findById((product as any).seller).select('name rating location phone email').lean()
    }

    // Transform data
    const transformedProduct = {
      _id: (product as any)._id.toString(),
      seller: sellerData ? {
        _id: sellerData._id?.toString() || sellerData.toString(),
        name: sellerData.name || 'Unknown',
        rating: sellerData.rating || { average: 0, count: 0 },
        location: sellerData.location,
        phone: sellerData.phone,
        email: sellerData.email,
      } : {
        _id: '',
        name: 'Unknown',
        rating: { average: 0, count: 0 },
      },
      title: (product as any).title,
      description: (product as any).description,
      price: (product as any).price,
      category: (product as any).category,
      images: (product as any).images,
      stock: (product as any).stock,
      location: (product as any).location,
      rating: (product as any).rating,
      isActive: (product as any).isActive,
      createdAt: (product as any).createdAt,
      updatedAt: (product as any).updatedAt,
    }

    return {
      success: true,
      data: transformedProduct,
    }
  } catch (error: any) {
    console.error('Fetch product error:', error)
    throw error
  }
})
