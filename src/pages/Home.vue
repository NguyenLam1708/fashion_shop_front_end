<template>
  <div>
    <Navbar />
    <main>
      <!-- Đang tải -->
      <div v-if="loading" class="loading">Đang tải sản phẩm...</div>

      <!-- Sau khi tải xong -->
      <div v-else>
        <!-- Không có sản phẩm -->
        <div v-if="products.length === 0" class="no-products">
          Chưa có sản phẩm nào.
        </div>

        <!-- Có sản phẩm -->
        <div v-else class="products">
          <div
            v-for="product in products"
            :key="product._id"
            class="product-wrapper"
          >
            <router-link :to="`/products/${product._id}`" class="product-card">
              <img :src="getImageUrl(product.imageUrl?.[0])" :alt="product.name" />
              <h3>{{ product.name }}</h3>
              <p>{{ product.price.toLocaleString() }}đ</p>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Phân trang -->
      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
          &lt;
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
          &gt;
        </button>
      </div>
    </main>
    <footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getAllProducts } from "../services/productService"

const products = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)

const getImageUrl = (path) => {
  if (!path) return "/no-image.png"
  return `http://localhost:8080/${path}`
}

const fetchProducts = async (page = 1) => {
  loading.value = true
  try {
    const res = await getAllProducts(page, 15) // 15 sản phẩm / trang
    products.value = res.data.products
    totalPages.value = res.data.totalPages
    currentPage.value = res.data.currentPage
  } catch (err) {
    console.error("Lỗi lấy sản phẩm:", err)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchProducts(page)
  }
}

onMounted(() => fetchProducts(1))
</script>

<style scoped>
.products {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 sản phẩm / hàng */
  gap: 20px;
  margin-top: 16px;
}

.product-wrapper {
  display: flex;
  justify-content: center;
}

.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 220px;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.product-card img {
  width: 100%;
  height: 160px; /* ảnh nhỏ hơn để card cao hơn */
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}

.product-card h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 6px 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.product-card p {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 2px 0;
  text-align: center;
}

.loading,
.no-products {
  text-align: center;
  font-size: 16px;
  margin: 20px 0;
}

/* Phân trang */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  font-weight: 600;
}

.pagination button {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination button:hover:not(:disabled) {
  background-color: #222;
}

.pagination button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
}
</style>
