<template>
  <div class="checkout">
    <h2>Thanh toán</h2>
    <form @submit.prevent="submitOrder">
      <label>Họ tên</label>
      <input v-model="name" required />
      
      <label>Địa chỉ</label>
      <input v-model="address" required />

      <label>Số điện thoại</label>
      <input v-model="phone" required />

      <button type="submit" class="btn">Đặt hàng</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const address = ref('')
const phone = ref('')

const submitOrder = () => {
  alert(`Đặt hàng thành công cho ${name.value}`)
}
</script>

<style scoped>
.checkout {
  padding: 20px;
  max-width: 400px;
  margin: auto;
}
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
}
.btn {
  background: #111;
  color: white;
  padding: 10px;
  border: none;
}
</style>
