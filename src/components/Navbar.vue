<template>
  <nav class="navbar">
    <!-- Logo -->
    <router-link to="/" class="logo">
      <img src="/src/assets/logo.png" alt="Fashion Shop" />
    </router-link>

    <!-- Search -->
    <div class="search-bar">
      <input type="text" placeholder="Bạn đang tìm gì..." />
      <button class="search-btn">
        <i class="fas fa-search" style="color: #222"></i>
      </button>
    </div>

    <!-- Menu bên phải -->
    <div class="nav-right">
      <router-link to="/cart" class="cart-link">
        <span class="icon"><i class="fas fa-shopping-cart"></i></span>
        Giỏ hàng
        <span v-if="cartStore.cartCount > 0" class="cart-badge">
          {{ cartStore.cartCount }}
        </span>
      </router-link>

      <!-- Nếu chưa login -->
      <router-link v-if="!userStore.user" to="/login">
        <span class="icon"><i class="fas fa-user"></i></span>
        Đăng nhập
      </router-link>

      <!-- Nếu đã login -->
      <div v-else class="user-menu" @click="toggleMenu">
        <span class="icon"><i class="fas fa-user"></i></span>
        {{ userStore.user.name }}
        <div v-if="showMenu" class="dropdown">
          <router-link to="/profile">Cập nhật thông tin</router-link>
          <router-link to="/change-password">Đổi mật khẩu</router-link>
          <router-link to="/orders">Đơn hàng</router-link>
          <a href="#" @click.prevent="logout">Đăng xuất</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "../stores/user"
import { useCartStore } from "../stores/cart"

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()
const showMenu = ref(false)

onMounted(() => {
  userStore.fetchUser()
  cartStore.fetchCartCount()
})

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const logout = () => {
  userStore.clearUser()
  router.push("/login")
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 10vh;
  background: #fff;
  color: #222;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}

.logo img {
  height: 100px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 8px #f39c12);
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  max-width: 600px;
  margin: 0 2rem;
}

.search-bar input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px 0 0 8px;
  border: none;
  font-size: 1rem;
  outline: none;
  background: #f7f7f7;
  color: #222;
}

.search-btn {
  border: 2px solid #f39c12;
  background: #fff;
  border-radius: 0 8px 8px 0;
  padding: 0 16px;
  cursor: pointer;
  height: 40px;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-right .icon {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
  vertical-align: middle;
}

.nav-right a {
  color: #222;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.user-menu {
  position: relative;
  cursor: pointer;
  font-weight: 500;
}

.dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  border: 1px solid #eee;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  min-width: 180px;
  z-index: 2000;
}

.dropdown a,
.dropdown router-link {
  padding: 10px 15px;
  color: #222;
  text-decoration: none;
  transition: background 0.2s;
}

.dropdown a:hover,
.dropdown router-link:hover {
  background: #f5f5f5;
}

.cart-link {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -14px;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  padding: 3px 7px;
  line-height: 1;
}
</style>
