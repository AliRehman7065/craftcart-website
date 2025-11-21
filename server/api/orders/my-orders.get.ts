import { defineEventHandler, getCookie } from 'h3'
import jwt from 'jsonwebtoken'
import { Order } from '~/server/models/Order'
import { User } from '~/server/models/User'
import { Product } from '~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookie
    const token = getCookie(event, 'auth_token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Not authenticated'
      })
    }

    // Verify token
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string }
    
    // Get customer's orders
    const orders = await Order.find({ customerId: decoded.userId })
      .populate('sellerId', 'name email')
      .populate('productId', 'title images price')
      .sort({ createdAt: -1 })
      .lean()

    // Transform orders for frontend
    const transformedOrders = orders.map((order: any) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-8).toUpperCase()}`,
      productId: order.productId?._id.toString() || '',
      productTitle: order.productId?.title || 'Product Unavailable',
      productImage: order.productId?.images?.[0] || '',
      productPrice: order.productPrice,
      quantity: order.quantity,
      totalAmount: order.totalAmount,
      status: order.status,
      sellerName: order.sellerId?.name || 'Unknown Seller',
      sellerEmail: order.sellerId?.email || '',
      sellerId: order.sellerId?._id.toString() || '',
      shippingAddress: {
        street: order.deliveryAddress.street,
        city: order.deliveryAddress.city,
        state: order.deliveryAddress.state,
        zipCode: order.deliveryAddress.pincode,
        phone: order.deliveryAddress.phone,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))

    return transformedOrders
  } catch (error: any) {
    console.error('Error fetching customer orders:', error)
    
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        message: 'Invalid token'
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch orders'
    })
  }
})
