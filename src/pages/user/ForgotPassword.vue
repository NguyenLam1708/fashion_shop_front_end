<template>
  <div class="forgot-password">
    <div class="forgot-box">
      <h2>Quên mật khẩu</h2>
      <form @submit.prevent="handleForgot">
        <input
          type="email"
          v-model="email"
          placeholder="Nhập email của bạn..."
          required
        />
        <p v-if="message" class="message">{{ message }}</p>
        <button type="submit">Gửi yêu cầu</button>
      </form>
      <p class="back-login">
        <router-link to="/login">Quay lại đăng nhập</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { forgotPassword } from "../../services/userService"

export default {
  data() {
    return {
      email: "",
      message: ""
    }
  },
  methods: {
    async handleForgot() {
      this.message = ""
      try {
        const res = await forgotPassword(this.email)
        this.message = res.data.message || "Vui lòng kiểm tra email để đặt lại mật khẩu!"
      } catch (err) {
        this.message = err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      }
    }
  }
}
</script>

<style scoped>
.forgot-password {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 70px;
}
.forgot-box {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}
.forgot-box h2 {
  margin-bottom: 1.5rem;
}
.forgot-box input {
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;       /* bo góc input */
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.forgot-box input:focus {
  outline: none;
  border-color: #007bff;    /* màu xanh khi focus */
}

.forgot-box button {
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 8px;       /* bo góc button */
  background: #222;         /* màu nền mặc định */
  color: #fff;
  cursor: pointer;
  transition: background 0.3s;
}

.forgot-box button:hover {
  background: #444;         /* khi hover thì sáng hơn */
}

.message {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #007bff;
}
.back-login {
  margin-top: 1rem;
}
</style>
