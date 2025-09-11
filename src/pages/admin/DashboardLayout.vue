<template>
  <div class="admin-layout">
    <!-- Navbar admin -->
    <AdminNavbar />

    <div class="admin-body">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <ul>
          <li :class="{ active: currentMenu === 'products' }" @click="setMenu('products')">📦 Quản lý sản phẩm</li>
          <li :class="{ active: currentMenu === 'users' }" @click="setMenu('users')">👤 Quản lý người dùng</li>
          <li :class="{ active: currentMenu === 'categories' }" @click="setMenu('categories')">🏷️ Quản lý danh mục</li>
          <li :class="{ active: currentMenu === 'orders' }" @click="setMenu('orders')">🛒 Quản lý đơn hàng</li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="admin-content">
        <div v-if="currentMenu === 'products'">
          <div class="header-actions">
            <h2>Danh sách sản phẩm</h2>
            <button class="btn btn-create" @click="openCreateModal">➕ Tạo sản phẩm</button>
          </div>

          <div v-if="loading" class="loading">Đang tải...</div>
          <div v-else>
            <div v-if="products.length === 0" class="empty">Chưa có sản phẩm nào.</div>

            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Danh mục</th>
                  <th>Size</th>
                  <th>Màu</th>
                  <th>Số lượng</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in products" :key="p._id">
                  <td>
                    <img v-if="p.imageUrl?.length" :src="getImageUrl(p.imageUrl[0])" class="product-img"/>
                    <span v-else>Chưa có ảnh</span>
                  </td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.price.toLocaleString() }} đ</td>
                  <td>{{ p.categoryId?.name || 'Chưa có' }}</td>
                  <td>{{ p.size }}</td>
                  <td>{{ p.color }}</td>
                  <td>{{ p.quantity }}</td>
                  <td>{{ new Date(p.createdAt).toLocaleDateString() }}</td>
                  <td>
                    <button class="btn btn-edit" @click="openEditModal(p)">✏️ Sửa</button>
                    <button class="btn btn-delete" @click="handleDeleteProduct(p._id)">🗑️ Xoá</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div class="pagination">
              <button :disabled="page===1" @click="goToPage(1)">«</button>
              <button :disabled="page===1" @click="goToPage(page-1)">‹</button>
              <button v-for="p in totalPages" :key="p" :class="{ active: p===page }" @click="goToPage(p)">{{ p }}</button>
              <button :disabled="page===totalPages" @click="goToPage(page+1)">›</button>
              <button :disabled="page===totalPages" @click="goToPage(totalPages)">»</button>
            </div>
          </div>
        </div>

        <!-- Modal tạo/sửa sản phẩm -->
        <div v-if="showModal" class="modal-overlay">
          <div class="modal">
            <h3>{{ editingProduct ? 'Sửa sản phẩm' : 'Tạo sản phẩm' }}</h3>
            <form @submit.prevent="submitForm">
              <label>
                Tên:
                <input v-model="form.name" required/>
              </label>
              <label>
                Mô tả:
                <textarea v-model="form.description" rows="4" placeholder="Nhập mô tả sản phẩm"></textarea>
              </label>
              <label>
                Giá:
                <input type="number" v-model.number="form.price" required/>
              </label>
              <label>
                Số lượng:
                <input type="number" v-model.number="form.quantity" required/>
              </label>
              <label>
                Size:
                <input v-model="form.size"/>
              </label>
              <label>
                Màu:
                <input v-model="form.color"/>
              </label>
              <label>
                Danh mục:
                <select v-model="form.categoryId" required>
                  <option value="" disabled>Chọn danh mục</option>
                  <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
                </select>
              </label>
              <label>
                Ảnh:
                <input type="file" multiple @change="handleFileChange"/>
              </label>
              <div class="modal-actions">
                <button type="submit" class="btn btn-save">Lưu</button>
                <button type="button" class="btn btn-cancel" @click="closeModal">Huỷ</button>
              </div>
            </form>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import AdminNavbar from '../../components/AdminNavbar.vue'
import { useToast } from 'vue-toastification'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService'
import { getAllCategories } from '../../services/categoryService'

const toast = useToast()

const currentMenu = ref('products')
const products = ref([])
const categories = ref([])
const loading = ref(false)
const page = ref(1)
const totalPages = ref(1)

// Modal state
const showModal = ref(false)
const editingProduct = ref(null)
const form = reactive({
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  size: '',
  color: '',
  categoryId: '',
  files: []
})

// ===================
// Fetch products
// ===================
const fetchProducts = async (p = 1) => {
  loading.value = true
  try {
    const res = await getAllProducts(p, 15)
    products.value = res.data.products
    totalPages.value = res.data.totalPages
    page.value = res.data.currentPage
  } catch(e) {
    toast.error('Lấy danh sách sản phẩm thất bại!')
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Fetch categories
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

// ===================
// CRUD
// ===================
const handleDeleteProduct = async (id) => {
  if(!confirm('Bạn có chắc muốn xoá sản phẩm này không?')) return
  try {
    const res = await deleteProduct(id)
    toast.success(res.message || 'Xoá sản phẩm thành công!')
    fetchProducts(page.value)
  } catch(err){
    toast.error(err.response?.data?.message || 'Không thể xoá sản phẩm, có thể đang trong đơn hàng hoặc giỏ hàng!')
    console.error(err)
  }
}

const openCreateModal = () => {
  editingProduct.value = null
  Object.assign(form, { name:'', description:'', price:0, quantity:0, size:'', color:'', categoryId:'', files:[] })
  fetchCategories()
  showModal.value = true
}

const openEditModal = (product) => {
  editingProduct.value = product
  Object.assign(form, { 
    name: product.name, 
    description: product.description,
    price: product.price, 
    quantity: product.quantity, 
    size: product.size, 
    color: product.color, 
    categoryId: product.categoryId?._id || '', 
    files: []
  })
  fetchCategories()
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

const handleFileChange = (e) => form.files = Array.from(e.target.files)

const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('price', form.price)
    formData.append('quantity', form.quantity)
    formData.append('size', form.size)
    formData.append('color', form.color)
    formData.append('categoryId', form.categoryId)

    if (form.files && form.files.length > 0) {
      form.files.forEach(file => formData.append('images', file))
    }

    if(editingProduct.value){
      await updateProduct(editingProduct.value._id, formData)
      toast.success('Cập nhật sản phẩm thành công!')
    } else {
      await createProduct(formData)
      toast.success('Tạo sản phẩm thành công!')
    }

    fetchProducts(page.value)
    closeModal()
  } catch(err){
    toast.error(err.response?.data?.message || 'Lỗi thao tác sản phẩm!')
    console.error(err)
  }
}

// ===================
// Helpers
// ===================
const setMenu = (menu) => { currentMenu.value = menu; if(menu==='products') fetchProducts() }
const getImageUrl = (path) => path ? `http://localhost:8080/${path}` : '/no-image.png'
const goToPage = (p) => { if(p>=1 && p<=totalPages.value){ page.value=p; fetchProducts(p) } }

onMounted(() => fetchProducts())
</script>

<style scoped>
/* Layout */
.admin-layout { display:flex; flex-direction:column; height:100vh; }
.admin-body { display:flex; flex:1; margin-top:10vh; }
.admin-sidebar { width:220px; background:#f4f4f4; border-right:1px solid #ddd; padding:1rem 0; }
.admin-sidebar ul { list-style:none; padding:0; margin:0; }
.admin-sidebar li { padding:.8rem 1.2rem; cursor:pointer; transition:.2s; }
.admin-sidebar li.active, .admin-sidebar li:hover { background:#ddd; font-weight:bold; }

.admin-content { flex:1; padding:1.5rem; overflow-y:auto; }
.header-actions { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }

/* Table */
.data-table { width:100%; border-collapse:collapse; margin-top:1rem; }
.data-table th, .data-table td { padding:.8rem; border:1px solid #ddd; text-align:left; }
.product-img { width:60px; height:60px; object-fit:cover; border-radius:4px; }

/* Buttons */
.btn { padding:6px 12px; border:none; border-radius:4px; cursor:pointer; transition:.2s; }
.btn-create { background:#28a745; color:#fff; }
.btn-create:hover { background:#218838; }
.btn-edit { background:#007bff; color:#fff; margin-right:4px; }
.btn-edit:hover { background:#0069d9; }
.btn-delete { background:#dc3545; color:#fff; }
.btn-delete:hover { background:#c82333; }

/* Pagination */
.pagination { margin-top:12px; display:flex; gap:6px; justify-content:center; }
.pagination button { border:1px solid #ddd; padding:6px 12px; cursor:pointer; border-radius:4px; background:#fff; transition:.2s; }
.pagination button.active { background:#000; color:#fff; }
.pagination button:disabled { background:#f5f5f5; color:#aaa; cursor:not-allowed; }

/* Modal */
.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
.modal { background:#fff; padding:20px; border-radius:8px; width:400px; max-width:90%; box-shadow:0 4px 12px rgba(0,0,0,.2); }
.modal h3 { margin-bottom:12px; }
.modal label { display:block; margin-bottom:10px; font-weight:500; }
.modal input, .modal textarea, .modal select { width:100%; padding:6px; margin-top:4px; border:1px solid #ccc; border-radius:4px; }
.modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:12px; }
.btn-save { background:#007bff; color:#fff; }
.btn-save:hover { background:#0069d9; }
.btn-cancel { background:#6c757d; color:#fff; }
.btn-cancel:hover { background:#5a6268; }

/* Loading / empty */
.loading, .empty { text-align:center; padding:20px; font-style:italic; color:#666; }
</style>
