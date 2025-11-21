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
    const { isActive } = body

    // Update the product's active status
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        isActive: isActive,
        updatedAt: new Date(),
      },
      { new: true }
    )

    return {
      success: true,
      message: `Product ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedProduct,
    }
  } catch (error: any) {
    console.error('Error toggling product status:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update product status',
    })
  }
})
