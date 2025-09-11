<template>
  <div class="collections-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/">Trang chủ</router-link> / 
      <span>{{ categoryName }}</span>
    </div>

    <div v-if="loading" class="loading">Đang tải sản phẩm...</div>

    <div v-else>
      <div v-if="products.length === 0" class="no-products">Chưa có sản phẩm nào.</div>

      <div v-else class="products">
        <div
          v-for="product in products"
          :key="product._id"
          class="product-card"
          @click="goToProductDetail(product._id)"
        >
          <img :src="getImageUrl(product.imageUrl?.[0])" alt="ảnh sản phẩm" />
          <h3>{{ product.name }}</h3>
          <p>{{ product.price.toLocaleString() }} đ</p>
        </div>
      </div>

      <!-- Phân trang -->
      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="currentPage === 1" @click="changePage(1)">
          &laquo;
        </button>
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
          &lt;
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
          &gt;
        </button>
        <button :disabled="currentPage === totalPages" @click="changePage(totalPages)">
          &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAllCategories } from "../services/categoryService";
import { getProductsByCategory } from "../services/productService";

const route = useRoute();
const router = useRouter();
const slug = ref(route.params.slug);

const products = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const totalPages = ref(1);
const categoryName = ref("");

// Ảnh dự phòng
const getImageUrl = (path) => path ? `http://localhost:8080/${path}` : "/no-image.png";

// Hàm fetch sản phẩm theo category
const fetchProducts = async (page = 1) => {
  loading.value = true;
  try {
    const catRes = await getAllCategories();
    const categories = catRes.data.data.categories || [];

    const category = categories.find(c => (c.slug || c.name.toLowerCase().replace(/\s+/g,'-')) === slug.value);

    if (!category) {
      products.value = [];
      categoryName.value = slug.value;
      totalPages.value = 1;
      currentPage.value = 1;
      return;
    }

    categoryName.value = category.name;

    const res = await getProductsByCategory(category._id, page, 15);
    products.value = res.data.products || [];
    totalPages.value = res.data.totalPages || 1;
    currentPage.value = res.data.currentPage || 1;

  } catch (err) {
    console.error("Lỗi lấy sản phẩm:", err);
    products.value = [];
    totalPages.value = 1;
    currentPage.value = 1;
  } finally {
    loading.value = false;
  }
};

// Thay đổi trang
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchProducts(page);
  }
};

// Điều hướng đến chi tiết sản phẩm
const goToProductDetail = (productId) => {
  router.push(`/products/${productId}`);
};

// Load khi mounted
onMounted(() => fetchProducts(1));

// Watch route thay đổi slug
watch(() => route.params.slug, (newSlug) => {
  slug.value = newSlug;
  fetchProducts(1);
});
</script>

<style scoped>
.loading,
.breadcrumb {
  font-size: 14px;
  margin-bottom: 8px;
}

.breadcrumb a {
  color: #000;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.products {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 sản phẩm / hàng */
  gap: 16px;
  margin-top: 16px;
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
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Ảnh */
.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}

/* Tên sản phẩm */
.product-card h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 4px 0;
  text-align: center;

  /* Giữ 2 dòng đều nhau */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  height: 36px; /* fix để card không cao thấp */
}

/* Giá */
.product-card p {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin: 2px 0;
  text-align: center;
}

/* Phân trang */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
}

.pagination button {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
  background-color: #000;
  color: #fff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #000;
  color: #fff;
  font-weight: bold;
}
</style>
