import { defineStore } from 'pinia'
import { getCart } from '../services/cartService'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartCount: 0
  }),
  actions: {
    async fetchCartCount() {
      try {
        const res = await getCart()
        const items = res.data.data?.items || []
        this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
      } catch (err) {
        this.cartCount = 0
      }
    },
    setCartCount(count) {
      this.cartCount = count
    }
  }
})
