<template>
  <div class="detail">
    <img :src="product?.imageUrl" alt="" class="image"/>
    <div class="info">
      <h2>{{ product?.name }}</h2>
      <p class="price">{{ product?.price }} VND</p>
      <p>{{ product?.description }}</p>
      <button class="btn" @click="addToCart(product)">Thêm vào giỏ</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProductById } from '../services/productService'
import { useCartStore } from '../store/cartStore'

const route = useRoute()
const product = ref(null)
const cartStore = useCartStore()

onMounted(async () => {
  const { data } = await getProductById(route.params.id)
  product.value = data
})

const addToCart = (p) => {
  cartStore.addToCart(p)
}
</script>

<style scoped>
.detail {
  display: flex;
  gap: 30px;
  padding: 20px;
}
.image {
  width: 300px;
  border: 1px solid #ccc;
}
.info {
  flex: 1;
}
.price {
  font-size: 20px;
  font-weight: bold;
  color: #e67e22;
}
.btn {
  padding: 10px 20px;
  background: #111;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
