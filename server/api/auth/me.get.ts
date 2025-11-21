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
    const decoded = jwt.verify(token, config.jwtSecret) as any

    // Fetch full user data from database
    const user = await User.findById(decoded.userId).select('-password')
    
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
        },
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token',
    })
  }
})
