export interface Order {
  id: string
  customerId: string
  sellerId: string
  productId: string
  product?: {
    title: string
    images: string[]
  }
  seller?: {
    name: string
  }
  quantity: number
  productPrice: number
  deliveryCharge: number
  totalAmount: number
  deliveryAddress: {
    street: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  status: OrderStatus
  paymentStatus: PaymentStatus
  razorpayOrderId?: string
  razorpayPaymentId?: string
  deliveryPartnerId?: string
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled'

export type PaymentStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'refunded'

export interface CreateOrderDTO {
  productId: string
  quantity: number
  deliveryAddress: {
    street: string
    city: string
    state: string
    pincode: string
    phone: string
  }
}

export interface OrdersResponse {
  success: boolean
  data: {
    orders: Order[]
  }
}
