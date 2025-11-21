import { Order } from '~/server/models/Order'
import { Product } from '~/server/models/Product'
import { User } from '~/server/models/User'
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

    // Check if user is a customer
    if (decoded.userType !== 'customer') {
      throw createError({
        statusCode: 403,
        message: 'Only customers can place orders',
      })
    }

    const body = await readBody(event)
    const { items, shippingAddress, totalAmount } = body

    // Validate items
    if (!items || items.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Cart is empty',
      })
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
      throw createError({
        statusCode: 400,
        message: 'Complete shipping address is required',
      })
    }

    const createdOrders = []
    const errors = []

    // Create separate orders for each item (as they may have different sellers)
    for (const item of items) {
      try {
        console.log('Processing item:', item)
        
        // Find product and verify stock
        const product = await Product.findById(item.productId)
        
        if (!product) {
          errors.push(`Product ${item.productId} not found`)
          continue
        }

        console.log('Product found:', { 
          id: product._id, 
          title: (product as any).title,
          stock: (product as any).stock,
          sellerId: (product as any).sellerId,
          seller: (product as any).seller
        })

        if ((product as any).stock < item.quantity) {
          errors.push(`Insufficient stock for ${(product as any).title}. Available: ${(product as any).stock}`)
          continue
        }

        // Get seller ID from product - handle both field names
        let sellerId = (product as any).sellerId || (product as any).seller
        
        // If seller ID is not set, use the item's sellerId from cart
        if (!sellerId && item.sellerId) {
          sellerId = item.sellerId
        }
        
        if (!sellerId) {
          errors.push(`No seller found for product ${(product as any).title}`)
          continue
        }

        console.log('Creating order with sellerId:', sellerId)

        // Generate unique order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

        // Create order
        const order = await Order.create({
          orderNumber: orderNumber,
          customerId: decoded.userId,
          sellerId: sellerId,
          productId: item.productId,
          quantity: item.quantity,
          productPrice: item.price,
          deliveryCharge: 0,
          totalAmount: item.price * item.quantity,
          deliveryAddress: {
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
            phone: shippingAddress.phone,
          },
          status: 'pending',
          paymentStatus: 'pending',
        })

        // Reduce product stock
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        })

        createdOrders.push(order)
      } catch (err: any) {
        console.error(`Error creating order for product ${item.productId}:`, err)
        errors.push(`Failed to create order for product ${item.productId}`)
      }
    }

    if (createdOrders.length === 0) {
      throw createError({
        statusCode: 400,
        message: errors.join(', ') || 'Failed to create any orders',
      })
    }

    return {
      success: true,
      message: `${createdOrders.length} order(s) placed successfully`,
      data: {
        orderId: createdOrders[0]._id.toString(),
        orderNumber: (createdOrders[0] as any).orderNumber,
        ordersCount: createdOrders.length,
        orders: createdOrders.map(o => ({
          id: o._id.toString(),
          orderNumber: (o as any).orderNumber,
          productId: (o as any).productId.toString(),
          quantity: (o as any).quantity,
          totalAmount: (o as any).totalAmount,
        })),
        errors: errors.length > 0 ? errors : undefined,
      },
    }
  } catch (error: any) {
    console.error('Error creating order:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create order',
    })
  }
})
