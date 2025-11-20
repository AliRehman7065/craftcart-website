import { Product } from '../../models/Product'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    const user = event.context.user
    if (!user || user.userType !== 'seller') {
      throw createError({
        statusCode: 403,
        message: 'Only sellers can create products',
      })
    }

    const body = await readBody(event)
    const { title, description, price, category, images, stock, location } = body

    // Validation
    if (!title || !description || !price || !category || !images?.length) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: title, description, price, category, and at least one image',
      })
    }

    // Create product
    const product = await Product.create({
      sellerId: user.userId,
      title,
      description,
      price: Number(price),
      category,
      images,
      stock: stock ? Number(stock) : 1,
      location,
    })

    return {
      success: true,
      data: {
        id: product._id.toString(),
        sellerId: product.sellerId.toString(),
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
      },
      message: 'Product created successfully',
    }
  } catch (error: any) {
    console.error('Product creation error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      throw createError({
        statusCode: 400,
        message: messages.join(', '),
      })
    }
    
    throw error
  }
})
