<template>
  <div class="login">
    <div class="login-box">
      <h2>Đăng nhập</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Nhập email của bạn..." required />
        <input v-model="password" type="password" placeholder="Nhập mật khẩu của bạn..." required />
        <button type="submit">Đăng nhập</button>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

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
  border-color: #f39c12; /* vàng cam nổi bật */
}

.login-box button {
  padding: 0.8rem;
  background: #f39c12;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.login-box button:hover {
  background: #d68910;
}

.message {
  margin-top: 1rem;
  font-size: 0.95rem;
  color: red;
}
</style>
