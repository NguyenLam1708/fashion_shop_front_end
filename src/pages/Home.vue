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

      <!-- Pagination -->
      <div class="pagination">
        <button :disabled="page === 1" @click="goToPage(1)">«</button>
        <button :disabled="page === 1" @click="goToPage(page - 1)">‹</button>

        <button
          v-for="p in visiblePages"
          :key="p + Math.random()"
          :class="{ active: p === page }"
          @click="typeof p === 'number' && goToPage(p)"
          :disabled="p === '...'"
        >
          {{ p }}
        </button>

        <button :disabled="page === totalPages" @click="goToPage(page + 1)">›</button>
        <button :disabled="page === totalPages" @click="goToPage(totalPages)">»</button>
      </div>
    </main>
    <footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { getAllProducts } from "../services/productService"

const products = ref([])
const loading = ref(true)
const page = ref(1)
const totalPages = ref(1)

const getImageUrl = (path) => {
  if (!path) return "/no-image.png"
  return `http://localhost:8080/${path}`
}

const fetchProducts = async (pageParam = 1) => {
  loading.value = true
  try {
    const res = await getAllProducts(pageParam, 15)
    products.value = res.data.products
    totalPages.value = res.data.totalPages
    page.value = res.data.currentPage
  } catch (err) {
    console.error("Lỗi lấy sản phẩm:", err)
  } finally {
    loading.value = false
  }
}

const goToPage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    fetchProducts(p)
  }
}

// Phân trang rút gọn nếu nhiều trang
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = page.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total-4, total-3, total-2, total-1, total)
    } else {
      pages.push(1, '...', current-1, current, current+1, '...', total)
    }
  }

  return pages
})

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
  height: 160px;
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

/* Pagination */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.pagination button {
  border: 1px solid #ddd;
  background: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button.active {
  background: #000;
  color: #fff;
  font-weight: bold;
}

.pagination button:disabled {
  background: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}
</style>
