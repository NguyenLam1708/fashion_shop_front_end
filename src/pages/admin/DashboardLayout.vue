<template>
  <div class="admin-layout">
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

      <!-- Main content -->
      <main class="admin-content">
        <!-- ================== Products ================== -->
        <div v-if="currentMenu==='products'">
          <div class="header-actions">
            <h2>Danh sách sản phẩm</h2>
            <button class="btn btn-create" @click="openCreateProductModal">➕ Tạo sản phẩm</button>
          </div>
          <div v-if="loadingProducts" class="loading">Đang tải...</div>
          <div v-else>
            <div v-if="products.length===0" class="empty">Chưa có sản phẩm nào.</div>
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
                  <td>{{ p.categoryId?.name || '-' }}</td>
                  <td>{{ p.size || '-' }}</td>
                  <td>{{ p.color || '-' }}</td>
                  <td>{{ p.quantity }}</td>
                  <td>{{ new Date(p.createdAt).toLocaleDateString() }}</td>
                  <td>
                    <button class="btn btn-edit" @click="openEditProductModal(p)">✏️ Sửa</button>
                    <button class="btn btn-delete" @click="deleteProductById(p._id)">🗑️ Xoá</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Pagination -->
            <div class="pagination">
              <button :disabled="pageProducts===1" @click="goToPageProducts(1)">«</button>
              <button :disabled="pageProducts===1" @click="goToPageProducts(pageProducts-1)">‹</button>
              <button v-for="p in totalPagesProducts" :key="p" :class="{ active: p===pageProducts }" @click="goToPageProducts(p)">{{ p }}</button>
              <button :disabled="pageProducts===totalPagesProducts" @click="goToPageProducts(pageProducts+1)">›</button>
              <button :disabled="pageProducts===totalPagesProducts" @click="goToPageProducts(totalPagesProducts)">»</button>
            </div>
          </div>
        </div>

        <!-- ================== Users ================== -->
        <div v-if="currentMenu==='users'">
          <div class="header-actions"><h2>Danh sách người dùng</h2></div>
          <div v-if="loadingUsers" class="loading">Đang tải...</div>
          <div v-else>
            <div v-if="users.length===0" class="empty">Chưa có người dùng nào.</div>
            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Role</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in users" :key="u._id">
                  <td>{{ u.name }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.phone||'-' }}</td>
                  <td>{{ u.address||'-' }}</td>
                  <td>{{ u.role }}</td>
                  <td>{{ getUserStatusText(u.status) }}</td>  
                  <td>{{ new Date(u.createdAt).toLocaleDateString() }}</td>
                  <td class="actions">
                    <button class="btn btn-edit" @click="openEditUserModal(u)">✏️Sửa</button>
                    <button
                      class="btn"
                      :class="u.status==='banned'?'btn-active':'btn-delete'"
                      @click="toggleBan(u)"
                    >
                      {{ u.status==='banned' ? '🔓Mở khóa' : '🔒Cấm' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="pagination">
              <button :disabled="pageUsers===1" @click="goToPageUsers(1)">«</button>
              <button :disabled="pageUsers===1" @click="goToPageUsers(pageUsers-1)">‹</button>
              <button v-for="p in totalPagesUsers" :key="p" :class="{ active: p===pageUsers }" @click="goToPageUsers(p)">{{ p }}</button>
              <button :disabled="pageUsers===totalPagesUsers" @click="goToPageUsers(pageUsers+1)">›</button>
              <button :disabled="pageUsers===totalPagesUsers" @click="goToPageUsers(totalPagesUsers)">»</button>
            </div>
          </div>
        </div>

        <!-- ================== Categories ================== -->
        <div v-if="currentMenu==='categories'">
          <div class="header-actions">
            <h2>Danh sách danh mục</h2>
            <button class="btn btn-create" @click="openCreateCategoryModal">➕ Tạo danh mục</button>
          </div>
          <div v-if="loadingCategories" class="loading">Đang tải...</div>
          <div v-else>
            <div v-if="categoriesData.length===0" class="empty">Chưa có danh mục nào.</div>
            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in categoriesData" :key="c._id">
                  <td>{{ c.name }}</td>
                  <td>{{ new Date(c.createdAt).toLocaleDateString() }}</td>
                  <td>
                    <button class="btn btn-edit" @click="openEditCategoryModal(c)">✏️ Sửa</button>
                    <button class="btn btn-delete" @click="deleteCategoryById(c._id)">🗑️ Xoá</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="pagination">
              <button :disabled="pageCategories===1" @click="goToPageCategories(1)">«</button>
              <button :disabled="pageCategories===1" @click="goToPageCategories(pageCategories-1)">‹</button>
              <button v-for="p in totalPagesCategories" :key="p" :class="{ active: p===pageCategories }" @click="goToPageCategories(p)">{{ p }}</button>
              <button :disabled="pageCategories===totalPagesCategories" @click="goToPageCategories(pageCategories+1)">›</button>
              <button :disabled="pageCategories===totalPagesCategories" @click="goToPageCategories(totalPagesCategories)">»</button>
            </div>
          </div>
        </div>
        <!-- ================== Orders ================== -->
        <div v-if="currentMenu==='orders'">
          <div class="header-actions"><h2>Danh sách đơn hàng</h2></div>
          <div v-if="loadingOrders" class="loading">Đang tải...</div>
          <div v-else>
            <div v-if="orders.length===0" class="empty">Chưa có đơn hàng nào.</div>

            <div v-else class="orders-list">
              <div class="order-card" v-for="o in orders" :key="o._id">
                <!-- Header -->
                <div class="order-header">
                  <div><strong>Mã đơn:</strong> {{ o._id }}</div>
                  <div><strong>Khách:</strong> {{ o.userId?.name || '-' }}</div>
                  <div><strong>Ngày:</strong> {{ new Date(o.createdAt).toLocaleDateString() }}</div>
                  <div class="status" :class="o.status">{{ getStatusText(o.status) }}</div>
                </div>

                <!-- Products -->
                <div class="order-items">
                  <div v-for="item in o.items" :key="item._id" class="order-item">
                    <img :src="getImageUrl(item.productId?.imageUrl?.[0])" alt=""/>
                    <div class="info">
                      <div class="product-name">{{ item.productId?.name }}</div>
                      <div>SL: {{ item.quantity }} x {{ item.price.toLocaleString() }} đ</div>
                    </div>
                    <div class="item-total">{{ (item.quantity * item.price).toLocaleString() }} đ</div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="order-footer">
                  <div><strong>Thanh toán:</strong> {{ getPaymentStatusText(o.paymentStatus) }}</div>
                  <div><strong>Phương thức:</strong> {{ o.paymentMethod==='COD' ? 'Thanh toán khi nhận hàng' : 'VNPAY' }}</div>
                  <div class="order-total">Tổng: {{ o.totalAmount?.toLocaleString() }} đ</div>
                </div>

                <!-- Actions -->
                <div class="order-actions">
                  <select v-model="o.status" @change="updateOrderStatus(o)">
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>

                  <select v-model="o.paymentStatus" @change="updateOrderStatus(o)">
                    <option value="pending">Đang xử lý</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="failed">Thanh toán thất bại</option>
                    <option value="unpaid">Chưa thanh toán</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="pagination">
              <button :disabled="pageOrders===1" @click="goToPageOrders(1)">«</button>
              <button :disabled="pageOrders===1" @click="goToPageOrders(pageOrders-1)">‹</button>
              <button v-for="p in totalPagesOrders" :key="p" :class="{ active: p===pageOrders }" @click="goToPageOrders(p)">{{ p }}</button>
              <button :disabled="pageOrders===totalPagesOrders" @click="goToPageOrders(pageOrders+1)">›</button>
              <button :disabled="pageOrders===totalPagesOrders" @click="goToPageOrders(totalPagesOrders)">»</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- ================== Modals ================== -->
    <!-- Product Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingProduct ? 'Sửa sản phẩm' : 'Tạo sản phẩm' }}</h3>
        <form @submit.prevent="submitProductForm">
          <label>Tên: <input v-model="form.name" required/></label>
          <label>Mô tả: <textarea v-model="form.description"></textarea></label>
          <label>Giá: <input type="number" v-model.number="form.price" required/></label>
          <label>Số lượng: <input type="number" v-model.number="form.quantity" required/></label>
          <label>Size: <input v-model="form.size"/></label>
          <label>Màu: <input v-model="form.color"/></label>
          <label>
            Danh mục:
            <select v-model="form.categoryId" required>
              <option value="" disabled>Chọn danh mục</option>
              <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
            </select>
          </label>
          <label>
            Ảnh:
            <input type="file" multiple @change="e => form.files = [...e.target.files]"/>
          </label>
          <div class="modal-actions">
            <button type="submit" class="btn btn-save">Lưu</button>
            <button type="button" class="btn btn-cancel" @click="closeProductModal">Huỷ</button>
          </div>
        </form>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="showUserModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingUser ? 'Sửa user' : 'Tạo user' }}</h3>
        <form @submit.prevent="submitUserForm">
          <label>Tên: <input v-model="userForm.name" required/></label>
          <label>Điện thoại: <input v-model="userForm.phone"/></label>
          <label>Địa chỉ: <input v-model="userForm.address"/></label>
          <label>Role:
            <select v-model="userForm.role">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <div class="modal-actions">
            <button type="submit" class="btn btn-save">Lưu</button>
            <button type="button" class="btn btn-cancel" @click="closeUserModal">Huỷ</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ editingCategory ? 'Sửa danh mục' : 'Tạo danh mục' }}</h3>
        <form @submit.prevent="submitCategoryForm">
          <label>Tên: <input v-model="categoryForm.name" required/></label>
          <div class="modal-actions">
            <button type="submit" class="btn btn-save">Lưu</button>
            <button type="button" class="btn btn-cancel" @click="closeCategoryModal">Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import AdminNavbar from '../../components/AdminNavbar.vue'
import { useToast } from 'vue-toastification'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService'
import { getAllUsers, updateUser, banUser, activeUser } from '../../services/userService'
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService'
import { getAllOrders, updateOrder } from '../../services/orderService'

const toast = useToast()
const currentMenu = ref('products')

// ---------------- Products ----------------
const products = ref([]), loadingProducts = ref(false), pageProducts = ref(1), totalPagesProducts = ref(1)
const showModal = ref(false), editingProduct = ref(null)
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
const categories = ref([])

// ---------------- Users ----------------
const users = ref([]), loadingUsers = ref(false), pageUsers = ref(1), totalPagesUsers = ref(1)
const showUserModal = ref(false), editingUser = ref(null)
const userForm = reactive({ name:'', phone:'', address:'', role:'user' })

// ---------------- Categories ----------------
const categoriesData = ref([]), loadingCategories = ref(false), pageCategories = ref(1), totalPagesCategories = ref(1)
const showCategoryModal = ref(false), editingCategory = ref(null)
const categoryForm = reactive({ name:'' })

// ---------------- Orders ----------------
const orders = ref([]), loadingOrders = ref(false), pageOrders = ref(1), totalPagesOrders = ref(1)

// ---------------- Functions ----------------
const setMenu = (menu) => { 
  currentMenu.value = menu
  if(menu==='products') fetchProducts(pageProducts.value)
  if(menu==='users') fetchUsers(pageUsers.value)
  if(menu==='categories') fetchCategories(pageCategories.value)
  if(menu==='orders') fetchOrders(pageOrders.value)
}

// ---------------- Products ----------------
const fetchProducts = async (p=1) => {
  loadingProducts.value = true
  try {
    const res = await getAllProducts(p,15)
    products.value = res.data.products
    totalPagesProducts.value = res.data.totalPages
    pageProducts.value = res.data.currentPage

    // lấy danh mục để select khi tạo / sửa sản phẩm
    const catRes = await getAllCategories(1,100)
    categories.value = catRes.data.data?.categories || []
  } catch(err){ toast.error('Lấy sản phẩm thất bại!') } 
  finally { loadingProducts.value=false }
}
const goToPageProducts = (p)=>{ if(p>=1 && p<=totalPagesProducts.value) { pageProducts.value=p; fetchProducts(p) } }
const openCreateProductModal=()=>{ 
  editingProduct.value=null
  Object.assign(form,{name:'',description:'',price:0,quantity:0,size:'',color:'',categoryId:'',files:[]})
  showModal.value=true
}
const openEditProductModal=(p)=>{
  editingProduct.value = p
  Object.assign(form,{
    name: p.name,
    description: p.description,
    price: p.price,
    quantity: p.quantity,
    size: p.size,
    color: p.color,
    categoryId: p.categoryId?._id || '',
    files: []
  })
  showModal.value=true
}
const closeProductModal=()=>{ showModal.value=false; editingProduct.value=null }

const submitProductForm = async () => {
  try {
    const formData = new FormData()
    for (const key in form) {
      if (key === 'files') {
        form.files.forEach(f => formData.append('images', f))
      } else {
        formData.append(key, form[key])
      }
    }

    if (editingProduct.value) {
      await updateProduct(editingProduct.value._id, formData)
      toast.success('Cập nhật sản phẩm thành công')
    } else {
      await createProduct(formData)
      toast.success('Tạo sản phẩm thành công')
    }

    fetchProducts(pageProducts.value)
    closeProductModal()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Thao tác thất bại!')
  }
}

const deleteProductById=async(id)=>{
  if(!confirm('Bạn có chắc muốn xoá sản phẩm này?')) return
  try{ 
    await deleteProduct(id); 
    toast.success('Xoá sản phẩm thành công'); 
    fetchProducts(pageProducts.value) 
  }catch(err){ toast.error('Xoá thất bại!') }
}

// ---------------- Users ----------------
const fetchUsers = async (p=1)=>{
  loadingUsers.value=true
  try {
    const res = await getAllUsers(p,10)
    users.value = res.data.data.users
    totalPagesUsers.value = res.data.data.totalPages
    pageUsers.value = res.data.data.currentPage
  } catch(err){ toast.error('Lấy user thất bại!') }
  finally { loadingUsers.value=false }
}
const goToPageUsers=(p)=>{ if(p>=1 && p<=totalPagesUsers.value){ pageUsers.value=p; fetchUsers(p) } }
const toggleBan = async(user)=>{
  try{
    if(user.status==='banned'){ await activeUser(user._id); toast.success('Mở khóa user') }
    else { await banUser(user._id); toast.success('Cấm user') }
    fetchUsers(pageUsers.value)
  } catch(err){ toast.error('Thao tác thất bại!') }
}
const openEditUserModal = (u) => { editingUser.value = u; Object.assign(userForm,u); showUserModal.value=true }
const closeUserModal = () => { showUserModal.value=false; editingUser.value=null }
const submitUserForm = async () => {
  try {
    if(editingUser.value){
      await updateUser(editingUser.value._id,userForm)
      toast.success('Cập nhật user thành công')
    }
    fetchUsers(pageUsers.value)
    closeUserModal()
  } catch(err){ toast.error(err.response?.data?.message||'Thao tác thất bại!') }
}

// ---------------- Categories ----------------
const fetchCategories = async(p=1)=>{
  loadingCategories.value=true
  try{
    const res = await getAllCategories(p,10)
    categoriesData.value = res.data.data?.categories || []
    totalPagesCategories.value = res.data.data?.totalPages || 1
    pageCategories.value = res.data.data?.currentPage || 1
  } catch(err){ toast.error('Lấy danh mục thất bại!') }
  finally { loadingCategories.value=false }
}
const goToPageCategories=(p)=>{ if(p>=1 && p<=totalPagesCategories.value){ pageCategories.value=p; fetchCategories(p) } }
const openCreateCategoryModal=()=>{ editingCategory.value=null; categoryForm.name=''; showCategoryModal.value=true }
const openEditCategoryModal=(c)=>{ editingCategory.value=c; categoryForm.name=c.name; showCategoryModal.value=true }
const closeCategoryModal=()=>{ showCategoryModal.value=false; editingCategory.value=null }
const submitCategoryForm=async()=>{ 
  try{
    if(editingCategory.value){ 
      await updateCategory(editingCategory.value._id, categoryForm.name) 
      toast.success('Cập nhật danh mục thành công') 
    }else{ 
      await createCategory(categoryForm.name) 
      toast.success('Tạo danh mục thành công') 
    } 
    fetchCategories(pageCategories.value) 
    closeCategoryModal() 
  } catch(err){ 
    toast.error(err.response?.data?.message||'Thao tác thất bại!') 
  }
}
const deleteCategoryById = async(id)=>{
  if(!confirm('Bạn có chắc muốn xoá danh mục này?')) return
  try{
    await deleteCategory(id)
    toast.success('Xoá danh mục thành công')
    await fetchCategories(pageCategories.value) // ⚡ refresh lại list
  }catch(err){ 
    toast.error(err.response?.data?.message || 'Xoá thất bại!') 
  }
}
// ---------------- Orders ----------------
const fetchOrders = async(p=1)=>{
  loadingOrders.value=true
  try{
    const res = await getAllOrders(p,10)
    orders.value = res.data.data.orders
    totalPagesOrders.value = res.data.data.totalPages
    pageOrders.value = res.data.data.currentPage
  }catch(err){ toast.error('Lấy đơn hàng thất bại!') }
  finally{ loadingOrders.value=false }
}

const goToPageOrders=(p)=>{ if(p>=1 && p<=totalPagesOrders.value){ pageOrders.value=p; fetchOrders(p) } }

const updateOrderStatus = async(order)=>{
  try{
    await updateOrder(order._id, order.status, order.paymentStatus)
    toast.success('Cập nhật đơn hàng thành công')
    fetchOrders(pageOrders.value)
  }catch(err){ toast.error(err.response?.data?.message||'Cập nhật thất bại!') }
}
// ---------------- Helpers ----------------
const getImageUrl = (path) => path? `http://localhost:8080/${path}`:'/no-image.png'

const getStatusText = (status) => {
  switch (status) {
    case "pending": return "Chờ xử lý"
    case "confirmed": return "Đã xác nhận"
    case "shipped": return "Đang giao"
    case "delivered": return "Đã giao"
    case "cancelled": return "Đã hủy"
    default: return status
  }
}

const getPaymentStatusText = (paymentStatus) => {
  switch (paymentStatus) {
    case "pending": return "Đang xử lý"
    case "paid": return "Đã thanh toán"
    case "failed": return "Thanh toán thất bại"
    case "unpaid": return "Chưa thanh toán"
    default: return paymentStatus
  }
}

const getUserStatusText = (status) => {
  switch (status) {
    case "active": return "Đang hoạt động"
    case "banned": return "Bị cấm"
    default: return status
  }
}

// ---------------- On Mounted ----------------
onMounted(()=>{
  if(currentMenu.value==='products') fetchProducts(pageProducts.value)
  if(currentMenu.value==='users') fetchUsers(pageUsers.value)
  if(currentMenu.value==='categories') fetchCategories(pageCategories.value)
  if(currentMenu.value==='orders') fetchOrders(pageOrders.value)

})
</script>

<style scoped>
/* Giữ nguyên style cũ */
.admin-layout { display:flex; flex-direction:column; height:100vh; }
.admin-body { display:flex; flex:1; margin-top:10vh; }
.admin-sidebar { width:220px; background:#f4f4f4; border-right:1px solid #ddd; padding:1rem 0; }
.admin-sidebar ul { list-style:none; padding:0; margin:0; }
.admin-sidebar li { padding:.8rem 1.2rem; cursor:pointer; transition:.2s; }
.admin-sidebar li.active, .admin-sidebar li:hover { background:#ddd; font-weight:bold; }

.admin-content { flex:1; padding:1.5rem; overflow-y:auto; }
.header-actions { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }

.data-table { width:100%; border-collapse:collapse; margin-top:1rem; }
.data-table th, .data-table td { padding:.8rem; border:1px solid #ddd; text-align:left; }
.product-img { width:60px; height:60px; object-fit:cover; border-radius:4px; }

.btn { padding:6px 12px; border:none; border-radius:4px; cursor:pointer; transition:.2s; }
.btn-create { background:#28a745; color:#fff; }
.btn-create:hover { background:#218838; }
.btn-edit { background:#007bff; color:#fff; margin-right:4px; }
.btn-edit:hover { background:#0069d9; }
.btn-delete { background:#dc3545; color:#fff; }
.btn-delete:hover { background:#c82333; }

.pagination { margin-top:12px; display:flex; gap:6px; justify-content:center; }
.pagination button { border:1px solid #ddd; padding:6px 12px; cursor:pointer; border-radius:4px; background:#fff; transition:.2s; }
.pagination button.active { background:#000; color:#fff; }
.pagination button:disabled { background:#f5f5f5; color:#aaa; cursor:not-allowed; }

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

/* Orders list */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #fff;              /* nền trắng */
  border: 1px solid #eee;        /* viền nhẹ */
  border-radius: 8px;            /* bo góc */
  box-shadow: 0 2px 6px rgba(0,0,0,0.05); /* bóng nhẹ */
  padding: 16px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 6px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;  /* gạch dưới nhẹ */
  font-size: 14px;
  color: #333;
}

.status {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}
.status.pending { background:#fffbe6; color:#8c6d1f; }
.status.confirmed { background:#e6f7ff; color:#096dd9; }
.status.shipped { background:#f0f0ff; color:#2c2c8a; } /* đổi từ shipping -> shipped */
.status.delivered { background:#e6ffed; color:#237804; }
.status.cancelled { background:#fff1f0; color:#a8071a; }

.order-items {
  display: flex;
  flex-direction: column;
}
.order-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;  /* gạch dưới nhẹ */
}
.order-item:last-child {
  border-bottom: none; /* bỏ gạch cuối */
}
.order-item img {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border-bottom: 1px solid #eee;  /* gạch dưới nhẹ */
}
.order-item .info { flex: 1; font-size: 14px; }
.order-item .product-name { font-weight: 500; margin-bottom: 4px; }

.item-total {
  min-width: 90px;
  text-align: right;
  font-weight: bold;
  color: #222;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 13px;
  color: #555;
  margin-top: 12px;
  padding-top: 10px;
  border-bottom: 1px solid #eee;  /* gạch dưới nhẹ */
}

.order-total {
  font-weight: 700;
  color: #d9363e;
}

/* Update Order Selects */
.order-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
.order-actions select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: all .2s;
}
.order-actions select:hover {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.1);
}
/* Categories table */
.data-table th {
  background: #f9f9f9;
  font-weight: 600;
  font-size: 14px;
}

.data-table td {
  font-size: 14px;
  vertical-align: middle;
}

/* Action buttons in category */
.data-table td .btn {
  padding: 5px 10px;
  font-size: 13px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.data-table td .btn-edit {
  background: #1890ff;
  color: #fff;
  margin-right: 6px;
}
.data-table td .btn-edit:hover {
  background: #40a9ff;
}

.data-table td .btn-delete {
  background: #ff4d4f;
  color: #fff;
}
.data-table td .btn-delete:hover {
  background: #ff7875;
}

.loading, .empty { text-align:center; padding:20px; font-style:italic; color:#666; }
</style>
