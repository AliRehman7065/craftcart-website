export interface ChatMessage {
  id: string
  orderId: string
  senderId: string
  senderName: string
  text: string
  timestamp: number
  isRead: boolean
}

export interface Chat {
  id: string
  orderId: string
  participants: {
    customerId: string
    sellerId: string
  }
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}
