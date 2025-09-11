<template>
  <div class="orders-page">
    <!-- Loading -->
    <div v-if="loading" class="loading">Đang tải đơn hàng...</div>

    <!-- Không có đơn -->
    <div v-else-if="orders.length === 0" class="empty">
      Bạn chưa có đơn hàng nào.
    </div>

    <!-- Có đơn -->
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order._id" class="order-card">
        <!-- Header -->
        <div class="order-header">
          <p><strong>Mã đơn:</strong> {{ order._id }}</p>
          <p><strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}</p>
          <p>
            <strong>Trạng thái:</strong>
            <span :class="['status', order.status]">{{ getStatusText(order.status) }}</span>
          </p>
        </div>

        <!-- Items -->
        <div class="order-items">
          <div
            v-for="(item, index) in order.items"
            :key="item._id"
            class="order-item"
            :class="{ 'last-item': index === order.items.length - 1 }"
          >
            <!-- Ảnh sản phẩm -->
            <router-link
              :to="`/products/${item.productId?._id}`"
              class="product-link"
            >
              <img
                v-if="item.productId?.imageUrl?.length"
                :src="getImageUrl(item.productId.imageUrl[0])"
                alt="Product"
              />
            </router-link>

            <!-- Thông tin -->
            <div class="info">
              <router-link
                :to="`/products/${item.productId?._id}`"
                class="product-name"
              >
                {{ item.name }}
              </router-link>
              <p>Giá: {{ item.price.toLocaleString() }} đ x {{ item.quantity }}</p>
              <p>Size: <strong>{{ item.productId?.size }}</strong></p>
              <p>Màu: <strong>{{ item.productId?.color }}</strong></p>
            </div>

            <!-- Thành tiền -->
            <div class="item-total">
              <strong>{{ (item.price * item.quantity).toLocaleString() }} đ</strong>
            </div>
          </div>

          <!-- Tổng tiền -->
          <div class="order-total">
            <span><strong>Tổng tiền:</strong></span>
            <span class="total-amount">{{ order.totalAmount.toLocaleString() }} đ</span>
          </div>
        </div>

        <div class="order-footer">
          <div class="footer-info">
            <p><strong>Địa chỉ:</strong> {{ order.shippingAddress }}</p>
            <p><strong>Thanh toán:</strong> {{ order.paymentMethod }} - {{ order.paymentStatus }}</p>
          </div>

          <!-- ✅ Thay confirm() bằng el-popconfirm -->
          <el-popconfirm
            v-if="order.status === 'pending'"
            confirm-button-text="Có"
            cancel-button-text="Không"
            icon="el-icon-warning"
            title="Bạn có chắc chắn muốn hủy đơn này?"
            @confirm="handleCancel(order._id)"
          >
            <template #reference>
              <button class="cancel-btn">Huỷ đơn</button>
            </template>
          </el-popconfirm>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button :disabled="page === 1" @click="goToPage(1)">«</button>
        <button :disabled="page === 1" @click="goToPage(page - 1)">‹</button>

        <button
          v-for="p in totalPages"
          :key="p"
          :class="{ active: p === page }"
          @click="goToPage(p)"
        >
          {{ p }}
        </button>

        <button :disabled="page === totalPages" @click="goToPage(page + 1)">›</button>
        <button :disabled="page === totalPages" @click="goToPage(totalPages)">»</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getOrders, cancelOrder } from "../../services/orderService"
import { useToast } from "vue-toastification"
import "element-plus/dist/index.css" // ✅ thêm Element Plus CSS
import { ElPopconfirm } from "element-plus"

const orders = ref([])
const loading = ref(true)
const page = ref(1)
const totalPages = ref(1)
const toast = useToast()

const getImageUrl = (path) =>
  path ? `http://localhost:8080/${path}` : "/no-image.png"

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString("vi-VN")
}

const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận"
    case "confirmed":
      return "Đã xác nhận"
    case "shipped":
      return "Đang giao"
    case "delivered":
      return "Đã giao"
    case "completed":
      return "Hoàn thành"
    case "cancelled":
      return "Đã hủy"
    default:
      return status
  }
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await getOrders(page.value)
    orders.value = res.data.data.orders || []
    totalPages.value = res.data.data.totalPages || 1
  } catch (err) {
    toast.error("Lỗi khi tải đơn hàng")
  } finally {
    loading.value = false
  }
}

const goToPage = (p) => {
  if (p >= 1 && p <= totalPages.value) {
    page.value = p
    fetchOrders()
  }
}

// 👉 Hàm hủy đơn
const handleCancel = async (orderId) => {
  try {
    const res = await cancelOrder(orderId)
    toast.success(res.data.message)
    fetchOrders()
  } catch (err) {
    toast.error(err.response?.data?.message || "Không thể hủy đơn")
  }
}

onMounted(fetchOrders)
</script>

<style scoped>
@import "vue-toastification/dist/index.css"; /* 👉 thêm ở đây */
</style>

<style scoped>
.orders-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}

.empty {
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-top: 40px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 14px;
  margin-bottom: 12px;
}

.order-items {
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;
}

.order-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed #e0e0e0;
}

.order-item.last-item {
  border-bottom: none;
}

.order-item img {
  width: 100px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.order-item .info {
  flex: 1;
}

.item-total {
  min-width: 120px;
  text-align: right;
  font-weight: bold;
  color: #222;
}

.order-total {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  font-size: 15px;
  font-weight: bold;
  color: #000;
}

.order-footer {
  margin-top: 12px;
  font-size: 14px;
  color: #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
}
.status.pending {
  background: #fff3cd;
  color: #856404;
}
.status.confirmed {
  background: #d1ecf1;
  color: #0c5460;
}
.status.shipped {
  background: #e2e3ff;
  color: #2c2c8a;
}
.status.delivered {
  background: #cce5ff;
  color: #004085;
}
.status.completed {
  background: #d4edda;
  color: #155724;
}
.status.cancelled {
  background: #f8d7da;
  color: #721c24;
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

/* Link sản phẩm */
.product-link,
.product-name {
  text-decoration: none;
  color: #000;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.2s;
}

.product-link:hover,
.product-name:hover {
  color: #333;
}

.cancel-btn {
  margin-top: 8px;
  padding: 6px 12px;
  background: #010101ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.cancel-btn:hover {
  background: #d9363e;
}
</style>
