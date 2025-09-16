<template>
  <div class="product-detail-page">
    <div v-if="loading" class="loading">Đang tải sản phẩm...</div>

    <div v-else-if="product" class="product-detail-container">
      <!-- Bên trái: gallery ảnh -->
      <div class="product-images">
        <div class="main-image-wrapper" @click="openLightbox(selectedImage)">
          <button class="arrow left" @click.stop="prevImage">&#10094;</button>
          <img :src="getImageUrl(product.imageUrl[selectedImage])" :alt="product.name" />
          <button class="arrow right" @click.stop="nextImage">&#10095;</button>
        </div>

        <div class="thumbnail-images">
          <img 
            v-for="(img, index) in product.imageUrl" 
            :key="index" 
            :src="getImageUrl(img)" 
            :alt="product.name"
            :class="{ active: index === selectedImage }"
            @click="selectedImage = index"
          />
        </div>
      </div>

      <!-- Bên phải: thông tin sản phẩm -->
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p v-if="product.categoryId" class="category"><strong>Danh mục:</strong> {{ product.categoryId.name }}</p>
        <p class="price">{{ product.price.toLocaleString() }} đ</p>
        <p class="description">{{ product.description || "Không có mô tả" }}</p>
        <p class="size"><strong>Size:</strong> {{ product.size || "Chưa có" }}</p>
        <p class="color"><strong>Màu:</strong> {{ product.color || "Chưa có" }}</p>

        <!-- Số lượng -->
        <div class="quantity-wrapper">
          <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
          <span>{{ quantity }}</span>
          <button @click="increaseQuantity" :disabled="quantity >= product.quantity">+</button>
        </div>

        <!-- Nút hành động -->
        <div class="action-buttons">
          <button class="add-to-cart" @click="handleAddToCart">Thêm vào giỏ hàng</button>
          <button class="buy-now" @click="handleBuyNow">Mua ngay</button>
        </div>
      </div>
    </div>

    <div v-else>
      <p>Sản phẩm không tồn tại</p>
    </div>

    <!-- Lightbox -->
    <div v-if="lightbox.open" class="lightbox" @click="closeLightbox">
      <img :src="getImageUrl(product.imageUrl[lightbox.index])" class="lightbox-image" @click.stop />
      <button class="lightbox-arrow left" @click.stop="prevLightbox">&#10094;</button>
      <button class="lightbox-arrow right" @click.stop="nextLightbox">&#10095;</button>
      <span class="lightbox-close" @click="closeLightbox">&times;</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById } from '../../services/productService'
import { addToCart } from '../../services/cartService'
import { useCartStore } from "../../stores/cart" 

const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()
const productId = route.params.id

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const selectedImage = ref(0)
const lightbox = ref({ open: false, index: 0 })

const getImageUrl = (path) => path ? `http://localhost:8080/${path}` : '/no-image.png'

const fetchProduct = async () => {
  loading.value = true
  try {
    const productData = await getProductById(productId)
    product.value = productData
  } catch (err) {
    console.error('Lỗi lấy chi tiết sản phẩm:', err)
    product.value = null
  } finally {
    loading.value = false
  }
}

const increaseQuantity = () => { if(quantity.value < product.value.quantity) quantity.value++ }
const decreaseQuantity = () => { if(quantity.value > 1) quantity.value-- }

// gọi API thêm vào giỏ
const handleAddToCart = async () => {
  try {
    await addToCart(product.value._id, quantity.value)
    await cartStore.fetchCartCount()   // 🔥 cập nhật lại state ngay
  } catch (err) {
    console.error('Lỗi thêm giỏ hàng:', err)
  }
}
const handleBuyNow = () => {
  // Chuyển sang trang checkout, truyền id sản phẩm và số lượng
  router.push({
    name: "Checkout",
    query: {
      items: JSON.stringify([product.value._id]),
      qty: quantity.value, // truyền thêm số lượng
    },
  })
}

const prevImage = () => { selectedImage.value = selectedImage.value > 0 ? selectedImage.value-1 : product.value.imageUrl.length-1 }
const nextImage = () => { selectedImage.value = selectedImage.value < product.value.imageUrl.length-1 ? selectedImage.value+1 : 0 }

// Lightbox
const openLightbox = (index) => { lightbox.value = { open: true, index } }
const closeLightbox = () => { lightbox.value.open = false }
const prevLightbox = () => { lightbox.value.index = lightbox.value.index > 0 ? lightbox.value.index-1 : product.value.imageUrl.length-1 }
const nextLightbox = () => { lightbox.value.index = lightbox.value.index < product.value.imageUrl.length-1 ? lightbox.value.index+1 : 0 }

onMounted(() => { fetchProduct() })
</script>

<style scoped>
.product-detail-page {
  background-color: #f5f5f5;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.product-detail-container {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

/* Gallery */
.product-images {
  flex: 1;
  min-width: 300px;
}

.main-image-wrapper {
  position: relative;
  max-width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 12px;
  background: #f9f9f9;
  cursor: pointer;
}

.main-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s;
}

.main-image-wrapper img:hover {
  transform: scale(1.02);
}

/* Arrow buttons */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #000;
  border: none;
  font-size: 24px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
}

.arrow.left {
  left: 10px;
}

.arrow.right {
  right: 10px;
}

/* Thumbnail images */
.thumbnail-images {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.thumbnail-images img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.thumbnail-images img.active,
.thumbnail-images img:hover {
  border-color: #000;
  transform: scale(1.05);
}

/* Product info */
.product-info {
  flex: 1;
  min-width: 250px;
}

.product-info h1 {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 12px;
}

.product-info .price {
  font-size: 24px;
  font-weight: 700;
  color: #e53935;
  margin-bottom: 12px;
}

.product-info .description,
.product-info .size,
.product-info .color,
.product-info .category {
  font-size: 15px;
  margin-bottom: 10px;
  color: #555;
}

/* Quantity */
.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.quantity-wrapper button {
  width: 36px;
  height: 36px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  border-radius: 6px;
  transition: all 0.2s;
}

.quantity-wrapper button:hover:not(:disabled) {
  background: #f0f0f0;
  transform: scale(1.05);
}

.quantity-wrapper button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.add-to-cart,
.buy-now {
  flex: 1;
  padding: 14px 0;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  border: none;
}

.add-to-cart {
  background: #000;
  color: #fff;
}

.add-to-cart:hover {
  background: #fff;
  color: #000;
  transform: translateY(-2px);
  border: 2px solid #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.buy-now {
  background: #fff;
  color: #000;
  border: 2px solid #000;
}

.buy-now:hover {
  background: #000;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}
/* Gallery */
.product-images {
  flex: 1;
  min-width: 300px;
}

.main-image-wrapper {
  position: relative;
  max-width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 12px;
  background: #f9f9f9;
  cursor: pointer;
}

.main-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s;
}

.main-image-wrapper img:hover {
  transform: scale(1.02);
}

/* Arrow buttons */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #000;
  border: none;
  font-size: 24px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
}

.arrow.left {
  left: 10px;
}

.arrow.right {
  right: 10px;
}

/* Thumbnail images */
.thumbnail-images {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.thumbnail-images img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.thumbnail-images img.active,
.thumbnail-images img:hover {
  border-color: #000;
  transform: scale(1.05);
}

/* Product info */
.product-info {
  flex: 1;
  min-width: 250px;
}

.product-info h1 {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 12px;
}

.product-info .price {
  font-size: 24px;
  font-weight: 700;
  color: #e53935;
  margin-bottom: 12px;
}

.product-info .description,
.product-info .size,
.product-info .color,
.product-info .category {
  font-size: 15px;
  margin-bottom: 10px;
  color: #555;
}

/* Quantity */
.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.quantity-wrapper button {
  width: 36px;
  height: 36px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  border-radius: 6px;
  transition: all 0.2s;
}

.quantity-wrapper button:hover:not(:disabled) {
  background: #f0f0f0;
  transform: scale(1.05);
}

.quantity-wrapper button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.add-to-cart,
.buy-now {
  flex: 1;
  padding: 14px 0;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  border: none;
}

.add-to-cart {
  background: #000;
  color: #fff;
}

.add-to-cart:hover {
  background: #fff;
  color: #000;
  transform: translateY(-2px);
  border: 2px solid #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.buy-now {
  background: #fff;
  color: #000;
  border: 2px solid #000;
}

.buy-now:hover {
  background: #000;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.lightbox-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 36px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  padding: 8px 12px;
  cursor: pointer;
}

.lightbox-arrow.left {
  left: 30px;
}

.lightbox-arrow.right {
  right: 30px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 40px;
  color: #fff;
  cursor: pointer;
}



</style>
