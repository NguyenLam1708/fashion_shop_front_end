<template>
  <div class="change-password">
    <div class="change-password-box">
      <h2>Đổi mật khẩu</h2>

      <!-- Nếu có lỗi -->
      <p v-if="error" class="error">{{ error }}</p>
      <!-- Nếu thành công -->
      <p v-if="message" class="message">{{ message }}</p>

      <form @submit.prevent="handleChangePassword">
        <!-- Mật khẩu cũ -->
        <div class="form-group">
          <label>Mật khẩu cũ</label>
          <div class="password-field">
            <input
              :type="show.old ? 'text' : 'password'"
              v-model="form.oldPassword"
              placeholder="Nhập mật khẩu cũ"
              required
            />
            <span class="toggle-eye" @click="show.old = !show.old">
              <i :class="show.old ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
        </div>

        <!-- Mật khẩu mới -->
        <div class="form-group">
          <label>Mật khẩu mới</label>
          <div class="password-field">
            <input
              :type="show.new ? 'text' : 'password'"
              v-model="form.newPassword"
              placeholder="Nhập mật khẩu mới"
              required
            />
            <span class="toggle-eye" @click="show.new = !show.new">
              <i :class="show.new ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
        </div>

        <!-- Nhập lại mật khẩu mới -->
        <div class="form-group">
          <label>Nhập lại mật khẩu mới</label>
          <div class="password-field">
            <input
              :type="show.confirm ? 'text' : 'password'"
              v-model="form.confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              required
            />
            <span class="toggle-eye" @click="show.confirm = !show.confirm">
              <i :class="show.confirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
        </div>

        <button type="submit">Đổi mật khẩu</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { changePassword } from "../../services/userService"

const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
})

const error = ref("")
const message = ref("")
const show = ref({
  old: false,
  new: false,
  confirm: false,
})

const handleChangePassword = async () => {
  error.value = ""
  message.value = ""

  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = "Mật khẩu mới và nhập lại không khớp!"
    return
  }

  try {
    const res = await changePassword(
      form.value.oldPassword,
      form.value.newPassword,
      form.value.confirmPassword
    )
    message.value = res.data.message || "Đổi mật khẩu thành công!"
    form.value = { oldPassword: "", newPassword: "", confirmPassword: "" }
    show.value = { old: false, new: false, confirm: false }
  } catch (err) {
    error.value = err.response?.data?.message || "Đổi mật khẩu thất bại!"
  }
}
</script>

<style scoped>
.change-password {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}

.change-password-box {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.change-password-box h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #555;
}

.password-field {
  position: relative;
}

.password-field input {
  width: 100%;
  padding: 0.8rem 2.5rem 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
}

.password-field input:focus {
  border-color: #888;
}

.toggle-eye {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.1rem;
  color: #666;
}

button {
  padding: 0.8rem;
  width: 100%;
  background: #222;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #444;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.message {
  color: green;
  margin-top: 1rem;
  text-align: center;
}
</style>
