<template>
  <div class="container">
    <h2>Tất cả sản phẩm</h2>
    <div class="grid">
      <ProductCard 
        v-for="p in products" 
        :key="p._id" 
        :product="p" 
        @add-to-cart="addToCart" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllProducts } from '../services/productService'
import { useCartStore } from '../store/cartStore'
import ProductCard from '../components/ProductCard.vue'

const products = ref([])
const cartStore = useCartStore()

onMounted(async () => {
  const { data } = await getAllProducts()
  products.value = data
})

const addToCart = (product) => {
  cartStore.addToCart(product)
}
</script>

<style scoped>
.container {
  padding: 20px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(200px,1fr));
  gap: 20px;
}
</style>
