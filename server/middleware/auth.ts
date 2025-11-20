import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // Skip auth for public routes
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/products',
    '/api/health',
  ]
  
  const path = event.path || ''
  
  // Check if route is public (exact match or starts with public route for GET)
  const isPublicRoute = publicRoutes.some(route => {
    if (event.method === 'GET' && route === '/api/products') {
      return path.startsWith(route)
    }
    return path === route
  })
  
  if (isPublicRoute) {
    return
  }

  // Get token from cookie
  const token = getCookie(event, 'auth_token')
  
  if (!token) {
    // Only throw error if trying to access protected routes
    if (path.startsWith('/api/') && !isPublicRoute) {
      throw createError({
        statusCode: 401,
        message: 'Authentication required',
      })
    }
    return
  }

  try {
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as any
    
    // Attach user info to event context
    event.context.user = {
      userId: decoded.userId,
      userType: decoded.userType,
      email: decoded.email,
    }
  } catch (error) {
    // Only throw error if trying to access protected routes
    if (path.startsWith('/api/') && !isPublicRoute) {
      throw createError({
        statusCode: 401,
        message: 'Invalid or expired token',
      })
    }
  }
})
