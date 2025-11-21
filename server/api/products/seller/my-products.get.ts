import { Product } from '../../../models/Product'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

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
        message: 'Only sellers can access this resource',
      })
    }

    // Fetch seller's products (handle both sellerId and seller fields)
    // Convert userId to ObjectId for proper matching
    const sellerObjectId = new mongoose.Types.ObjectId(decoded.userId)
    
    const products = await Product
      .find({
        $or: [
          { sellerId: sellerObjectId },
          { seller: sellerObjectId },
          { sellerId: decoded.userId },
          { seller: decoded.userId }
        ]
      })
      .sort({ createdAt: -1 })
      .lean()

    console.log('Seller products query:', {
      sellerUserId: decoded.userId,
      productsFound: products.length,
      firstProductSeller: products[0]?.seller?.toString() || products[0]?.sellerId?.toString()
    })

    return {
      success: true,
      data: {
        products,
      },
    }
  } catch (error: any) {
    console.error('Error fetching seller products:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch products',
    })
  }
})
