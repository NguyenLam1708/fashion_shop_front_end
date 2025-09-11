<template>
  <div class="login">
    <div class="login-box">
      <h2>Đăng nhập</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Nhập email của bạn..." required />
        <p v-if="emailError" class="error-message">{{ emailError }}</p>

        <div class="password-field">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Nhập mật khẩu..."
            required
          />
          <span class="toggle-eye" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>

        <div class="forgot-link">
          <router-link to="/forgot-password">Quên mật khẩu?</router-link>
        </div>

        <button type="submit">Đăng nhập</button>
      </form>

      <p class="register-hint">
        Chưa có tài khoản?
        <router-link to="/register">Đăng ký</router-link>
      </p>

      <p v-if="activationNeeded" class="activation-hint">
        Tài khoản chưa kích hoạt?
        <a href="#" @click.prevent="goToVerify">Kích hoạt ngay</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "../../stores/user"
import { login } from "../../services/authService"
import { useCartStore } from "../../stores/cart" 

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const email = ref("")
const password = ref("")
const showPassword = ref(false)
const emailError = ref("")
const passwordError = ref("")
const activationNeeded = ref(false)

const handleLogin = async () => {
  emailError.value = ""
  passwordError.value = ""
  activationNeeded.value = false

  try {
    const res = await login({ email: email.value, password: password.value })

    if (res.data && res.data.token) {
      // ✅ Lưu token
      localStorage.setItem("token", res.data.token)

      // ✅ Fetch user ngay lập tức
      await userStore.fetchUser()
      await cartStore.fetchCartCount() 

      // ✅ Điều hướng theo role
      if (userStore.user?.role === "admin") {
        router.push("/dashboard")
      } else {
        router.push("/")
      }
    } else if (res.message && res.message.toLowerCase().includes("kích hoạt")) {
      activationNeeded.value = true
    } else if (res.message) {
      if (res.message.includes("Email")) {
        emailError.value = res.message
      } else if (res.message.includes("Mật khẩu")) {
        passwordError.value = res.message
      } else {
        passwordError.value = res.message
      }
    }
  } catch (err) {
    const msg = err.response?.data?.message
    if (msg && msg.toLowerCase().includes("kích hoạt")) {
      activationNeeded.value = true
    } else if (msg?.includes("Email")) {
      emailError.value = msg
    } else if (msg?.includes("Mật khẩu")) {
      passwordError.value = msg
    } else {
      passwordError.value = msg || "Có lỗi xảy ra, vui lòng thử lại!"
    }
  }
}

const goToVerify = () => {
  router.push({
    path: "/verify-otp",
    query: { email: email.value },
  })
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: vh;
  box-sizing: border-box;
  margin-top: 70px; /* đẩy xuống đúng bằng header */
}

.login-box {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-box h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.login-box form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-box input {
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.3s;
}

.login-box input:focus {
  border-color: #888;
}

.login-box button {
  padding: 0.8rem;
  background: #222;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.login-box button:hover {
  background: #444;
}

.forgot-link {
  text-align: right;
  margin-top: -0.5rem; /* kéo gần hơn ô password */
  font-size: 0.9rem;
}

.forgot-link a {
  color: #007bff;
  text-decoration: none;
}

.forgot-link a:hover {
  text-decoration: underline;
}

.register-hint {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 0.98rem;
}

.register-hint a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s;
}

.message {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: red;
}

.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field input {
  flex: 1;
  padding-right: 40px;
}

.toggle-eye {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #888;
  font-size: 1.2rem;
  user-select: none;
}

.toggle-eye:hover {
  color: #888;
}

.error-message {
  color: #ff5252;
  font-size: 0.95rem;
  margin: 4px 0 0 4px;
  text-align: left;
}

.activation-hint {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #555;
}

.activation-hint a {
  color: #007bff;
  text-decoration: none;
  margin-left: 4px;
  cursor: pointer;
}

.activation-hint a:hover {
  text-decoration: underline;
}
</style>
