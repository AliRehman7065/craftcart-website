export default defineEventHandler(async (event) => {
  try {
    // Clear the auth token cookie
    deleteCookie(event, 'auth_token', {
      path: '/',
    })

    return {
      success: true,
      message: 'Logout successful',
    }
  } catch (error: any) {
    console.error('Logout error:', error)
    throw createError({
      statusCode: 500,
      message: 'Logout failed',
    })
  }
})
