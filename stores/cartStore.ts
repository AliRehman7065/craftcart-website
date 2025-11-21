import { defineStore } from 'pinia'

interface CartItem {
  productId: string
  title: string
  price: number
  image: string
  quantity: number
  stock: number
  sellerId: string
  sellerName: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    cartItems: (state) => state.items,
    
    cartCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    cartTotal: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    
    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    addToCart(product: {
      _id: string
      title: string
      price: number
      images: string[]
      stock: number
      seller?: { _id: string; name: string }
    }) {
      const existingItem = this.items.find(item => item.productId === product._id)
      
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity++
        } else {
          throw new Error('Cannot add more items than available in stock')
        }
      } else {
        this.items.push({
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.images[0] || '',
          quantity: 1,
          stock: product.stock,
          sellerId: product.seller?._id || '',
          sellerName: product.seller?.name || '',
        })
      }
      
      this.saveToLocalStorage()
    },

    removeFromCart(productId: string) {
      const index = this.items.findIndex(item => item.productId === productId)
      if (index > -1) {
        this.items.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find(item => item.productId === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else if (quantity <= item.stock) {
          item.quantity = quantity
          this.saveToLocalStorage()
        }
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const saved = localStorage.getItem('cart')
        if (saved) {
          this.items = JSON.parse(saved)
        }
      }
    },
  },
})
