import { User } from '../../models/User'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, phone, password, userType } = body

    // Validation
    if (!name || !email || !phone || !password || !userType) {
      throw createError({
        statusCode: 400,
        message: 'All fields are required',
      })
    }

    // Validate user type
    if (!['seller', 'customer'].includes(userType)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid user type. Must be either "seller" or "customer"',
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'User already exists with this email',
      })
    }

    // Create new user (password will be hashed by the pre-save hook)
    const user = await User.create({
      name,
      email,
      phone,
      password,
      userType,
    })

    // Generate JWT token
    const config = useRuntimeConfig()
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        userType: user.userType,
        email: user.email,
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    // Set httpOnly cookie
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return {
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
          rating: user.rating,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      message: 'Registration successful',
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle mongoose validation errors
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
