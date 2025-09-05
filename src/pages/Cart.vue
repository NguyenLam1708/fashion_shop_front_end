<template>
  <div class="cart">
    <h2>Giỏ hàng</h2>
    <div v-if="items.length === 0">Chưa có sản phẩm nào</div>
    <table v-else>
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Tổng</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in items" :key="p._id">
          <td>{{ p.name }}</td>
          <td>{{ p.price }}</td>
          <td>{{ p.quantity }}</td>
          <td>{{ p.price * p.quantity }}</td>
          <td><button @click="remove(p._id)">Xóa</button></td>
        </tr>
      </tbody>
    </table>
    <p class="total">Tổng tiền: {{ total }} VND</p>
    <router-link to="/checkout" class="btn">Thanh toán</router-link>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '../store/cartStore'

const cart = useCartStore()
const { items, totalPrice: total } = storeToRefs(cart)

const remove = (id) => cart.removeFromCart(id)
</script>

<style scoped>
.cart {
  padding: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border: 1px solid #ccc;
}
.total {
  margin-top: 20px;
  font-size: 18px;
}
.btn {
  background: #e67e22;
  color: white;
  padding: 8px 15px;
  text-decoration: none;
}
</style>
