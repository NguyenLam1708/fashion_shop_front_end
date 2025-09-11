import { defineStore } from "pinia"
import api from "../services/api"

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loading: false
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === "admin"
  },
  actions: {
    setUser(user) {
      this.user = user
      localStorage.setItem("user", JSON.stringify(user))
    },
    clearUser() {
      this.user = null
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    },
    async fetchUser() {
      this.loading = true
      try {
        const res = await api.get("/users/my-info")
        this.setUser(res.data)
      } catch (err) {
        this.clearUser()
      } finally {
        this.loading = false
      }
    }
  }
})
