<template>
  <div class="category-bar">
    <div v-if="loading" class="loading">Đang tải...</div>
    <button
      v-for="category in categories"
      :key="category._id"
      @click="goToCategory(category)"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllCategories } from '../services/categoryService';

const categories = ref([]);
const loading = ref(true);
const router = useRouter();

const fetchCategories = async () => {
  try {
    const res = await getAllCategories();
    categories.value = res.data.data.categories || [];
  } catch (error) {
    console.error('Lỗi khi lấy category:', error);
  } finally {
    loading.value = false;
  }
};

// Khi click category, push slug vào route
const goToCategory = (category) => {
  // Sử dụng slug nếu API có, hoặc tạo từ name
  const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
  router.push(`/collections/${slug}`);
};

onMounted(fetchCategories);
</script>

<style scoped>
.category-bar {
  justify-content: center;
  position: sticky;
  top: 70px; 
  z-index: 50;
  display: flex;
  padding: 0.5rem 1rem;
  overflow-x: auto;
  min-height: 50px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.category-bar button {
  flex-shrink: 0;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  color: #333;
  font-weight: 700;
  font-size: 1rem;
  transition: color 0.2s, transform 0.2s;
}

.category-bar button:hover {
  color: #111;
  transform: translateY(-1px);
}
</style>
