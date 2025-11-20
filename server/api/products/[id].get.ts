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

    // Transform data
    const transformedProduct = {
      id: (product as any)._id.toString(),
      sellerId: (product as any).sellerId._id.toString(),
      seller: {
        name: (product as any).sellerId.name,
        rating: (product as any).sellerId.rating,
        location: (product as any).sellerId.location,
        phone: (product as any).sellerId.phone,
        email: (product as any).sellerId.email,
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
