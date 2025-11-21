import { Order } from '../../../models/Order'
import { User } from '../../../models/User'
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

    const sellerObjectId = new mongoose.Types.ObjectId(decoded.userId)

    // Fetch seller's orders
    const orders = await Order.find({ sellerId: sellerObjectId })
      .populate('customerId', 'name email phone')
      .populate('productId', 'title images')
      .sort({ createdAt: -1 })

    // Transform orders to include necessary details
    const transformedOrders = orders.map((order: any) => ({
      _id: order._id.toString(),
      orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-8).toUpperCase()}`,
      buyerId: order.customerId?._id?.toString() || '',
      buyerName: order.customerId?.name || 'Unknown',
      buyerEmail: order.customerId?.email || '',
      items: [{
        productId: order.productId?._id?.toString() || '',
        productTitle: order.productId?.title || 'Product',
        productImage: order.productId?.images?.[0] || '',
        quantity: order.quantity,
        price: order.productPrice,
      }],
      totalAmount: order.totalAmount,
      status: order.status,
      shippingAddress: {
        street: order.deliveryAddress.street,
        city: order.deliveryAddress.city,
        state: order.deliveryAddress.state,
        zipCode: order.deliveryAddress.pincode,
        phone: order.deliveryAddress.phone,
      },
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))

    return {
      success: true,
      data: {
        orders: transformedOrders,
        total: transformedOrders.length,
      },
    }
  } catch (error: any) {
    console.error('Error fetching seller orders:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch orders',
    })
  }
})
