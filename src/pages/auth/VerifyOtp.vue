<template>
  <div class="verify">
    <form @submit.prevent="handleVerify">
      <h2>Xác nhận OTP</h2>

      <input
        type="email"
        placeholder="Nhập email"
        v-model="emailInput"
        required
      />

      <input
        type="text"
        placeholder="Nhập mã OTP"
        v-model="otpCode"
        :class="{ 'input-error': error }"
        required
      />
      <p v-if="error" class="error-message">{{ error }}</p>

      <button type="submit">Xác nhận</button>

      <p v-if="message" class="message">{{ message }}</p>

      <p class="resend">
        Không nhận được OTP?
        <button type="button" @click="handleResend">Gửi lại</button>
      </p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { verifyOtp, resendOtp } from '../../services/authService'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const otpCode = ref('')
    const message = ref('')
    const error = ref('')
    const route = useRoute()
    const router = useRouter()

    // nếu query có email thì điền sẵn, nếu không thì để user nhập
    const emailInput = ref(route.query.email || '')

    const handleVerify = async () => {
      message.value = ''
      error.value = ''
      if (!otpCode.value.trim() || !emailInput.value.trim()) {
        error.value = 'Email và OTP không được bỏ trống'
        return
      }
      try {
        const res = await verifyOtp({
          email: emailInput.value,
          otpCode: otpCode.value  // ✅ đồng bộ với backend
        })
        message.value = res.message
        setTimeout(() => router.push('/login'), 2000)
      } catch (err) {
        error.value = err.response?.data?.message || 'Xác thực thất bại'
      }
    }

    const handleResend = async () => {
      message.value = ''
      error.value = ''
      if (!emailInput.value.trim()) {
        error.value = 'Vui lòng nhập email để gửi lại OTP'
        return
      }
      try {
        const res = await resendOtp({ email: emailInput.value })
        message.value = res.message
      } catch (err) {
        error.value = err.response?.data?.message || 'Không thể gửi lại OTP'
      }
    }

    return { otpCode, emailInput, message, error, handleVerify, handleResend }
  }
}
</script>

<style scoped>
.verify {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}

.verify form {
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

.verify h2 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.verify input {
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.3s;
}

.verify input:focus {
  border-color: #888;
}

.input-error {
  border-color: #ff5252 !important;
}

.verify button {
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

.verify button:hover {
  background: #444;
}

.resend button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 0;
}

/* ✅ Vô hiệu hóa hover */
.resend button:hover {
  background: none;
  color: #007bff;
}

.message {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: green;
}

.error-message {
  color: #ff5252;
  font-size: 0.95rem;
  margin: -0.5rem 0 0 4px;
  text-align: left;
}
</style>
