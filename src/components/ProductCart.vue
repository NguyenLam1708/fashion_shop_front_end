<template>
  <div class="border rounded-lg shadow hover:shadow-lg transition p-4">
    <img :src="product.imageUrl" alt="" class="w-full h-48 object-cover rounded-md" />
    <h3 class="font-semibold text-lg mt-2">{{ product.name }}</h3>
    <p class="text-gray-600">{{ formatCurrency(product.price) }}</p>
    <button 
      class="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      @click="$emit('add-to-cart', product)"
    >
      Thêm vào giỏ
    </button>
  </div>
</template>

<script setup>
import { formatCurrency } from '../utils/formatCurrency'

defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>
