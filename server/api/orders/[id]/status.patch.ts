import { Order } from '~/server/models/Order'
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
        message: 'Only sellers can update order status',
      })
    }

    // Get order ID from URL
    const orderId = getRouterParam(event, 'id')
    if (!orderId) {
      throw createError({
        statusCode: 400,
        message: 'Order ID is required',
      })
    }

    // Find the order
    const order = await Order.findById(orderId)
    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Order not found',
      })
    }

    // Check if the seller owns this order
    if ((order as any).sellerId.toString() !== decoded.userId) {
      throw createError({
        statusCode: 403,
        message: 'You are not authorized to update this order',
      })
    }

    // Get request body
    const body = await readBody(event)
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid order status',
      })
    }

    // If cancelling order, restore product stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      await Product.findByIdAndUpdate(
        (order as any).productId,
        {
          $inc: { stock: (order as any).quantity }
        }
      )
    }

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status: status,
        updatedAt: new Date(),
      },
      { new: true }
    )

    return {
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    }
  } catch (error: any) {
    console.error('Error updating order status:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update order status',
    })
  }
})
