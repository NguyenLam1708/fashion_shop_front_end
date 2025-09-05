<template>
  <div class="register">
    <form @submit.prevent="handleRegister">
      <h2>Đăng ký</h2>
      <input type="text" placeholder="Tên" v-model="name" required />
      <input type="email" placeholder="Email" v-model="email" required />
      <input type="text" placeholder="Số điện thoại" v-model="phone" required />
      <input type="text" placeholder="Địa chỉ" v-model="address" required />
      <div class="password-field">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Mật khẩu"
          v-model="password"
          required
        />
        <span class="toggle-eye" @click="showPassword = !showPassword">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>
      <button type="submit">Đăng ký</button>
      <p class="login-link">
        Đã có tài khoản?
        <router-link to="/login">Đăng nhập</router-link>
      </p>
      <p v-if="message" class="message">{{ message }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { register } from '../services/authService'

export default {
  setup() {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const phone = ref('')
    const address = ref('')
    const message = ref('')
    const showPassword = ref(false)

    const handleRegister = async () => {
      try {
        const res = await register({
          name: name.value,
          email: email.value,
          password: password.value,
          phone: phone.value,
          address: address.value
        })
        message.value = res.message
      } catch (err) {
        message.value = err.response?.data?.message || 'Đăng ký thất bại'
      }
    }

    return { name, email, password, phone, address, message, showPassword, handleRegister }
  }
}
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}
 
.register form {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register h2 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.register input {
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.3s;
}

.register input:focus {
  border-color: #888;
}

.register button {
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

.register button:hover {
  background: #444;
}

.login-link {
  margin-top: 1rem;
  font-size: 0.98rem;
  text-align: center;
}

.login-link a {
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
  margin-left: 4px;
}

.login-link a:hover {
  color: #222;
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
  color: #222;
}
</style>
