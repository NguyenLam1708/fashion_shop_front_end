<template>
  <div class="register">
    <h2>Đăng ký</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" type="text" placeholder="Tên" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mật khẩu" required />
      <input v-model="phone" type="text" placeholder="SĐT" required />
      <input v-model="address" type="text" placeholder="Địa chỉ" required />

      <button type="submit">Đăng ký</button>
    </form>
    <p v-if="message">{{ message }}</p>
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

    return { name, email, password, phone, address, message, handleRegister }
  }
}
</script>
