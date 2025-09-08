<template>
  <div class="register">
    <form @submit.prevent="handleRegister">
      <h2>Đăng ký</h2>

      <input
        type="text"
        placeholder="Tên"
        v-model="name"
        :class="{ 'input-error': errors.name }"
      />
      <p v-if="errors.name" class="error-message">{{ errors.name }}</p>

      <input
        type="email"
        placeholder="Email"
        v-model="email"
        :class="{ 'input-error': errors.email }"
      />
      <p v-if="errors.email" class="error-message">{{ errors.email }}</p>

      <input
        type="text"
        placeholder="Số điện thoại"
        v-model="phone"
        :class="{ 'input-error': errors.phone }"
      />
      <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>

      <input
        type="text"
        placeholder="Địa chỉ"
        v-model="address"
        :class="{ 'input-error': errors.address }"
      />
      <p v-if="errors.address" class="error-message">{{ errors.address }}</p>

      <div class="password-field">
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Mật khẩu"
          v-model="password"
          :class="{ 'input-error': errors.password }"
        />
        <span class="toggle-eye" @click="showPassword = !showPassword">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>
      <p v-if="errors.password" class="error-message">{{ errors.password }}</p>

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
import { useRouter } from 'vue-router'
import { register } from '../../services/authService'

export default {
  setup() {
    const router = useRouter()

    const name = ref('')
    const email = ref('')
    const password = ref('')
    const phone = ref('')
    const address = ref('')
    const message = ref('')
    const showPassword = ref(false)

    const errors = ref({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: ''
    })

    const validate = () => {
      let valid = true
      errors.value = { name: '', email: '', password: '', phone: '', address: '' }

      if (!name.value.trim()) {
        errors.value.name = 'Tên không được bỏ trống'
        valid = false
      }
      const emailRegex = /^\S+@\S+\.\S+$/
      if (!email.value.trim()) {
        errors.value.email = 'Email không được bỏ trống'
        valid = false
      } else if (!emailRegex.test(email.value)) {
        errors.value.email = 'Email không hợp lệ'
        valid = false
      }
      if (!password.value.trim()) {
        errors.value.password = 'Mật khẩu không được bỏ trống'
        valid = false
      } else if (password.value.length < 6) {
        errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        valid = false
      }
      const phoneRegex = /^[0-9]{9,15}$/
      if (!phone.value.trim()) {
        errors.value.phone = 'Số điện thoại không được bỏ trống'
        valid = false
      } else if (!phoneRegex.test(phone.value)) {
        errors.value.phone = 'Số điện thoại không hợp lệ'
        valid = false
      }
      if (!address.value.trim()) {
        errors.value.address = 'Địa chỉ không được bỏ trống'
        valid = false
      }

      return valid
    }

    const handleRegister = async () => {
      message.value = ''
      if (!validate()) return

      try {
        const res = await register({
          name: name.value,
          email: email.value,
          password: password.value,
          phone: phone.value,
          address: address.value
        })
        message.value = res.message

        // ✅ sau khi đăng ký thành công → chuyển sang verify otp
        router.push({
          path: '/verify-otp',
          query: { email: email.value }
        })


      } catch (err) {
        const msg = err.response?.data?.message || 'Đăng ký thất bại'
        if (msg.toLowerCase().includes('email')) {
          errors.value.email = msg
        } else {
          message.value = msg
        }
      }
    }

    return {
      name,
      email,
      password,
      phone,
      address,
      message,
      errors,
      showPassword,
      handleRegister
    }
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

.input-error {
  border-color: #ff5252 !important;
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

.error-message {
  color: #ff5252;
  font-size: 0.95rem;
  margin: -0.5rem 0 0 4px;
  text-align: left;
}
</style>
