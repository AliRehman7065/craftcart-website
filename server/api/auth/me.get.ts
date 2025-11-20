import jwt from 'jsonwebtoken'

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

    return {
      success: true,
      data: {
        userId: decoded.userId,
        userType: decoded.userType,
        email: decoded.email,
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token',
    })
  }
})
