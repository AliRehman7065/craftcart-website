import jwt from 'jsonwebtoken'
import { User } from '../../models/User'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth_token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Not authenticated',
      })
    }

    const config = useRuntimeConfig()
    let decoded: any
    
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError)
      throw createError({
        statusCode: 401,
        message: 'Invalid or expired token',
      })
    }

    // Fetch full user data from database with lean() for better performance
    const user = await User.findById(decoded.userId).select('-password').lean()
    
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'User not found',
      })
    }

    return {
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          userType: user.userType,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
          location: user.location,
          rating: user.rating,
        },
      },
    }
  } catch (error: any) {
    console.error('Auth check error:', error)
    if (error.statusCode === 401) {
      throw error
    }
    throw createError({
      statusCode: 401,
      message: 'Authentication failed',
    })
  }
})
