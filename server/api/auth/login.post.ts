import { User } from '~/server/models/User'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    // Validation
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required',
      })
    }

    // Find user with password field (it's excluded by default)
    const user = await User.findOne({ email }).select('+password')
    
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password',
      })
    }

    // Verify password using the model method
    const isPasswordValid = await user.comparePassword(password)
    
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password',
      })
    }

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
          location: user.location,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      message: 'Login successful',
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw error
  }
})
