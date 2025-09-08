<template>
  <div class="profile">
    <div class="profile-box">
      <h2>Thông tin cá nhân</h2>

      <!-- Nếu đang loading -->
      <p v-if="userStore.loading">Đang tải thông tin...</p>

      <!-- Form cập nhật -->
      <form v-if="!userStore.loading && userStore.user" @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Họ tên</label>
          <input 
            v-model="form.name" 
            type="text" 
            required 
            :class="{ 'input-error': errors.name }" 
          />
          <p v-if="errors.name" class="error">{{ errors.name }}</p>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" disabled />
        </div>

        <div class="form-group">
          <label>Số điện thoại</label>
          <input 
            v-model="form.phone" 
            type="text" 
            :class="{ 'input-error': errors.phone }" 
          />
          <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
        </div>

        <div class="form-group">
          <label>Địa chỉ</label>
          <input 
            v-model="form.address" 
            type="text" 
            :class="{ 'input-error': errors.address }" 
          />
          <p v-if="errors.address" class="error">{{ errors.address }}</p>
        </div>

        <button type="submit">Cập nhật</button>
      </form>

      <!-- Thông báo -->
      <p v-if="message" class="message">{{ message }}</p>
      <p v-if="errors.general" class="error">{{ errors.general }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useUserStore } from "../../stores/user"
import { changeInfo } from "../../services/userService"

const userStore = useUserStore()
const message = ref("")
const errors = ref({}) // object để lưu lỗi từng field

const form = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
})

onMounted(async () => {
  if (!userStore.user) {
    await userStore.fetchUser()
  }
  if (userStore.user) {
    form.value = {
      name: userStore.user.name,
      email: userStore.user.email,
      phone: userStore.user.phone || "",
      address: userStore.user.address || "",
    }
  }
})

// Hàm parse lỗi từ backend
function parseValidationMessage(msg) {
  const parsedErrors = {}
  if (!msg) return parsedErrors

  // Ví dụ msg = "Validation failed: phone: Số điện thoại không hợp lệ"
  const parts = msg.replace("Validation failed:", "").trim().split(",")
  parts.forEach(part => {
    const [field, ...rest] = part.split(":")
    if (field && rest.length) {
      parsedErrors[field.trim()] = rest.join(":").trim()
    }
  })

  return parsedErrors
}

const handleUpdate = async () => {
  message.value = ""
  errors.value = {}
  try {
    const { name, phone, address } = form.value
    const res = await changeInfo({ name, phone, address })
    message.value = res.data.message || "Cập nhật thành công!"
    await userStore.fetchUser()
  } catch (err) {
    const msg = err.response?.data?.message
    console.log("🔥 BACKEND ERROR:", msg) // debug log

    if (msg?.startsWith("Validation failed")) {
      errors.value = parseValidationMessage(msg)
      console.log("🔥 PARSED ERRORS:", errors.value) // debug log
    } else {
      errors.value.general = msg || "Cập nhật thất bại!"
    }
  }
}
</script>

<style scoped>
.profile {
  display: flex;
  justify-content: center;
  margin-top: 80px; /* tránh bị che bởi navbar */
}

.profile-box {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.profile-box h2 {
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

.form-group input {
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
}

.form-group input:focus {
  border-color: #888;
}

/* input có lỗi */
.input-error {
  border-color: red !important;
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
  font-size: 0.9rem;
  margin-top: 4px;
}

.message {
  color: green;
  margin-top: 1rem;
  text-align: center;
}
</style>
