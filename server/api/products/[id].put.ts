import { Product } from '~/server/models/Product'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    // Get auth token from cookies
    const token = getCookie(event, 'auth_token')

    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Authentication required',
      })
    }

    // Verify token
    const config = useRuntimeConfig()
    const decoded: any = jwt.verify(token, config.jwtSecret)

    // Check if user is a seller
    if (decoded.userType !== 'seller') {
      throw createError({
        statusCode: 403,
        message: 'Only sellers can update products',
      })
    }

    // Get product ID from URL
    const productId = getRouterParam(event, 'id')
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required',
      })
    }

    // Find the product
    const product = await Product.findById(productId)
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      })
    }

    // Check if the user is the seller of this product
    const productObj = product.toObject()
    const sellerId = productObj.sellerId || productObj.seller
    
    if (!sellerId) {
      console.error('Product has no sellerId or seller field:', productObj)
      throw createError({
        statusCode: 500,
        message: 'Product data is invalid',
      })
    }

    if (sellerId.toString() !== decoded.userId) {
      throw createError({
        statusCode: 403,
        message: 'You are not authorized to update this product',
      })
    }

    // Get request body
    const body = await readBody(event)
    const { title, description, price, category, images, stock, isActive } = body

    // Validate required fields
    if (!title || !description || !price || !category) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields',
      })
    }

    // Check for duplicate title (only if title is being changed)
    if (title.trim().toLowerCase() !== product.title.trim().toLowerCase()) {
      const existingProduct = await Product.findOne({
        _id: { $ne: productId },
        sellerId: decoded.userId,
        title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
      })

      if (existingProduct) {
        throw createError({
          statusCode: 409,
          message: 'You already have a product with this title. Please use a different title.',
        })
      }
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        price: Number(price),
        category,
        images: images || [],
        stock: Number(stock) || 0,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      },
      { new: true }
    )

    return {
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    }
  } catch (error: any) {
    console.error('Error updating product:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update product',
    })
  }
})
