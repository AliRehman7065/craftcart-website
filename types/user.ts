export interface User {
  id: string
  name: string
  email: string
  phone: string
  userType: 'seller' | 'customer'
  profileImage?: string
  isVerified: boolean
  rating: {
    average: number
    count: number
  }
  location?: {
    city?: string
    state?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface UserRegistration {
  name: string
  email: string
  phone: string
  password: string
  userType: 'seller' | 'customer'
}

export interface UserLogin {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
  }
}
