<template>
  <div class="checkout-page">
    <h2>Thanh toán</h2>

    <div v-if="loading">Đang tải...</div>
    <div v-else>
      <!-- Danh sách sản phẩm -->
      <div
        v-for="item in checkoutItems"
        :key="item.productId._id"
        class="checkout-item"
      >
        <img
          :src="getImageUrl(item.productId.imageUrl[0])"
          :alt="item.productId.name"
        />
        <div class="info">
          <h3>{{ item.productId.name }}</h3>
          <p>
            {{ item.productId.price.toLocaleString() }} đ x
            {{ item.quantity }}
          </p>
          <p>
            <em>Size: {{ item.productId.size }} | Màu: {{ item.productId.color }}</em>
          </p>
          <p>
            <strong>
              {{ (item.productId.price * item.quantity).toLocaleString() }} đ
            </strong>
          </p>
        </div>
      </div>

      <!-- Thông tin khách hàng -->
      <div class="user-info" v-if="userStore.user">
        <h3>Thông tin khách hàng</h3>
        <p><strong>Tên:</strong> {{ userStore.user.name }}</p>
        <p><strong>Email:</strong> {{ userStore.user.email }}</p>
        <p><strong>Điện thoại:</strong> {{ userStore.user.phone }}</p>
      </div>

      <!-- Địa chỉ giao hàng -->
      <div class="shipping">
        <h3>Địa chỉ giao hàng</h3>
        <textarea
          v-model="shippingAddress"
          placeholder="Nhập địa chỉ của bạn..."
        />
      </div>

      <!-- Tổng tiền -->
      <div class="total-row">
        <p>
          Tổng cộng:
          <strong>{{ total.toLocaleString() }} đ</strong>
        </p>
      </div>

      <!-- Nút đặt hàng -->
      <button class="btn-submit" @click="submitOrder">Đặt hàng COD</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getCart } from "../../services/cartService"
import { createOrderCOD } from "../../services/orderService"
import { useUserStore } from "../../stores/user"
import { useToast } from "vue-toastification"

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const loading = ref(true)
const checkoutItems = ref([])
const shippingAddress = ref("")
const selectedIds = JSON.parse(route.query.items || "[]")

const getImageUrl = (path) =>
  path ? `http://localhost:8080/${path}` : "/no-image.png"

const fetchCheckoutItems = async () => {
  loading.value = true
  try {
    const res = await getCart()
    const allItems = res.data.data?.items || []
    checkoutItems.value = allItems.filter((item) =>
      selectedIds.includes(item.productId._id)
    )
  } catch (err) {
    console.error("Lỗi load giỏ hàng:", err)
    toast.error("Không thể tải giỏ hàng!")
  } finally {
    loading.value = false
  }
}

const total = computed(() =>
  checkoutItems.value.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  )
)

const submitOrder = async () => {
  if (!shippingAddress.value.trim()) {
    toast.warning("Vui lòng nhập địa chỉ giao hàng")
    return
  }
  try {
    const selectedItems = checkoutItems.value.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }))
    await createOrderCOD(shippingAddress.value, selectedItems)
    toast.success("🎉 Đặt hàng thành công!")
    router.push({ name: "Home" })
  } catch (err) {
    console.error("Lỗi đặt hàng:", err)
    toast.error("Không thể đặt hàng. Vui lòng thử lại!")
  }
}

onMounted(async () => {
  if (!userStore.user) {
    await userStore.fetchUser()
  }
  if (userStore.user?.address) {
    shippingAddress.value = userStore.user.address
  }
  fetchCheckoutItems()
})
</script>

<style scoped>
.checkout-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.checkout-item {
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #eee;
  padding: 12px 0;
}
.checkout-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}
.info {
  flex: 1;
}
.user-info,
.shipping {
  margin: 20px 0;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.shipping textarea {
  width: 100%;
  min-height: 80px;
  margin-top: 8px;
  padding: 8px;
}
.total-row {
  text-align: right;
  margin: 20px 0;
  font-size: 18px;
  font-weight: bold;
}
.btn-submit {
  background: #000;
  color: #fff;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
}
.btn-submit:hover {
  background: #333;
}
</style>
