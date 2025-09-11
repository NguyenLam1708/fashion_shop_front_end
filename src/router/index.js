import Register from '../pages/auth/Register.vue'
import Login from '../pages/auth/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import VerifyOtp from '../pages/auth/VerifyOtp.vue'
import ForgotPassword from '../pages/user/ForgotPassword.vue'
import Profile from '../pages/user/Profile.vue'
import ChangePassword from '../pages/user/ChangePassword.vue'
import CollectionsPage from '../pages/CollectionsPage.vue'
import ProductDetail from '../pages/product/ProductDetail.vue'
import Cart from '../pages/cart/Cart.vue'
import Checkout from '../pages/order/Checkout.vue'
import Orders from '../pages/order/Orders.vue'
import { useUserStore } from "../stores/user"
import DashboardLayout from '../pages/admin/DashboardLayout.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },

  // Auth
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  { path: '/verify-otp', name: 'VerifyOtp', component: VerifyOtp },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },

  // User pages (cần login)
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/change-password', name: 'ChangePassword', component: ChangePassword, meta: { requiresAuth: true } },
  { path: '/orders', name: 'Orders', component: Orders, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: Checkout, meta: { requiresAuth: true } },

  // Product
  { path: '/collections/:slug', name: 'CollectionsPage', component: CollectionsPage, props: true },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetail, props: true },
  { path: '/cart', name: 'Cart', component: Cart, props: true },

  // Admin (cần admin)
  { path: "/dashboard", name: "Dashboard", component: DashboardLayout, meta: { requiresAdmin: true }}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 👉 Guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // nếu chưa fetch user (khi F5) thì gọi lại
  if (!userStore.user && localStorage.getItem("token")) {
    await userStore.fetchUser()
  }

  // nếu route cần login
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next("/login")
  }

  // nếu route cần admin
  if (to.meta.requiresAdmin) {
    if (!userStore.isLoggedIn) return next("/login")
    if (!userStore.isAdmin) return next("/") // không phải admin thì về home
  }

  next()
})

export default router
