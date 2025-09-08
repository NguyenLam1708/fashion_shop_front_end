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
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
          &lt;
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
          &gt;
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

    const res = await getProductsByCategory(category._id, page);
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
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.product-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
}

.product-card h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 4px 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.product-card p {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin: 2px 0;
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
