<template>
  <div class="login">
    <div class="login-box">
      <h2>Đăng nhập</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Nhập email của bạn..." required />
        <div class="password-field">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Nhập mật khẩu của bạn..."
            required
          />
          <span class="toggle-eye" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      <div class="login-links">
        <router-link to="/forgot-password">Quên mật khẩu?</router-link>
        <span>|</span>
        <router-link to="/register">Đăng ký</router-link>
      </div>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div> 
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      message: ''
    }
  },
  methods: {
    handleLogin() {
      // ...existing login logic...
    }
  }
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

.login-links {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 0.98rem;
}

.login-links a {
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}

.login-links a:hover {
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
  color: #888;
}
</style>
