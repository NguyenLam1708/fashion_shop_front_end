import Register from '../pages/auth/Register.vue'
import Login from '../pages/auth/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import VerifyOtp from '../pages/auth/VerifyOtp.vue'
import ForgotPassword from '../pages/user/ForgotPassword.vue'
import Profile from '../pages/user/Profile.vue'
import ChangePassword from '../pages/user/ChangePassword.vue'
import CollectionsPage from '../pages/CollectionsPage.vue';
import ProductDetail from '../pages/product/ProductDetail.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  { path: '/verify-otp', name: 'VerifyOtp', component: VerifyOtp },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/change-password', name: 'ChangePassword', component: ChangePassword },
  { path: '/collections/:slug', name: 'CollectionsPage', component: CollectionsPage, props: true },
  { path: '/products/:id', name: 'ProductDetail', component: ProductDetail, props: true },
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
