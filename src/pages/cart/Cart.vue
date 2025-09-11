<template>
  <div class="cart-page">
    <div v-if="loading" class="loading">Đang tải giỏ hàng...</div>

    <div v-else>
      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>Hiện chưa có sản phẩm</p>
      </div>

      <div v-else class="cart-container">
        <!-- Danh sách sản phẩm -->
        <div class="cart-items">
          <!-- Thanh công cụ -->
          <div class="cart-header">
            <div class="left-tools">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
              />
              <span>Chọn tất cả</span>
            </div>
            <div class="right-tools">
              <button
                class="btn-action"
                :disabled="selectedItems.length === 0"
                @click="removeSelectedItems"
                :class="{ disabled: selectedItems.length === 0 }"
              >
                Xóa đã chọn
              </button>
              <button class="btn-action danger" @click="clearAllCart">
                Xóa tất cả
              </button>
            </div>
          </div>

          <div
            v-for="item in cartItems"
            :key="item.productId._id"
            class="cart-item"
          >
            <!-- Checkbox chọn -->
            <input
              type="checkbox"
              v-model="selectedItems"
              :value="item.productId._id"
              class="item-checkbox"
            />

            <img
                :src="getImageUrl(item.productId.imageUrl[0])"
                :alt="item.productId.name"
                class="clickable"
                @click="goToProductDetail(item.productId._id)"
            />

            <div class="item-info">
                <h2 class="clickable" @click="goToProductDetail(item.productId._id)">
                    {{ item.productId.name }}
                </h2>
                <p class="price">{{ item.productId.price.toLocaleString() }} đ</p>
                <p class="variant">
                    Size: {{ item.productId.size }} | Màu: {{ item.productId.color }}
                </p>

              <div class="actions">
                <div class="quantity-wrapper">
                  <button
                    @click="updateQty(item.productId._id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >
                    -
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button
                    @click="updateQty(item.productId._id, item.quantity + 1)"
                  >
                    +
                  </button>
                </div>

                <button
                  class="remove-btn"
                  @click="removeItem(item.productId._id)"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>

        <div class="summary-row">
            <div class="total">
                Tổng tiền:
                <strong>{{ displayTotal.toLocaleString() }} đ</strong>
                <span class="hint" v-if="selectedItems.length > 0">
                ({{ selectedItems.length }} sản phẩm đã chọn)
                </span>
            </div>
            <button class="checkout" @click="goToCheckout">Thanh toán</button>
        </div>  
       </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../../services/cartService'
import { useCartStore } from '../../stores/cart'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()
const loading = ref(true)
const cartItems = ref([])
const selectedItems = ref([])
const selectAll = ref(false)

const getImageUrl = (path) =>
  path ? `http://localhost:8080/${path}` : '/no-image.png'

const fetchCart = async () => {
  loading.value = true
  try {
    const res = await getCart()
    cartItems.value = res.data.data?.items || []
  } catch (err) {
    console.error('Lỗi lấy giỏ hàng:', err)
    cartItems.value = []
  } finally {
    loading.value = false
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = cartItems.value.map((item) => item.productId._id)
  } else {
    selectedItems.value = []
  }
}

watch(selectedItems, (val) => {
  selectAll.value = val.length === cartItems.value.length && val.length > 0
})

const updateQty = async (productId, qty) => {
  if (qty < 1) return
  try {
    await updateQuantity(productId, qty)
    await fetchCart()
    await cartStore.fetchCartCount()
  } catch (err) {
    console.error('Lỗi cập nhật số lượng:', err)
  }
}

const removeItem = async (productId) => {
  try {
    await removeFromCart(productId)
    await fetchCart()
    await cartStore.fetchCartCount()
  } catch (err) {
    console.error('Lỗi xóa sản phẩm:', err)
  }
}

const removeSelectedItems = async () => {
  try {
    for (const id of selectedItems.value) {
      await removeFromCart(id)
    }
    selectedItems.value = []
    selectAll.value = false   
    await fetchCart()
    await cartStore.fetchCartCount()
  } catch (err) {
    console.error('Lỗi xóa sản phẩm đã chọn:', err)
  }
}

const clearAllCart = async () => {
  try {
    await clearCart()
    selectedItems.value = []
    await fetchCart()
    await cartStore.fetchCartCount()
  } catch (err) {
    console.error('Lỗi xóa toàn bộ giỏ:', err)
  }
}

/** Tính tiền */
const cartTotal = computed(() =>
  cartItems.value.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  )
)

const selectedTotal = computed(() =>
  cartItems.value.reduce((sum, item) => {
    if (selectedItems.value.includes(item.productId._id)) {
      return sum + item.productId.price * item.quantity
    }
    return sum
  }, 0)
)

const displayTotal = computed(() =>
  selectedItems.value.length > 0 ? selectedTotal.value : 0
)

const goToProductDetail = (productId) => {
  router.push(`/products/${productId}`)
}

const goToCheckout = () => {
  if (selectedItems.value.length === 0) {
    alert("Bạn chưa chọn sản phẩm nào để thanh toán!")
    return
  }
  router.push({
    name: "Checkout",
    query: { items: JSON.stringify(selectedItems.value) }
  })
}

onMounted(() => {
  fetchCart()
})
</script>

<style scoped>
.cart-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
}

.cart-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.cart-items {
  flex: 2;
}

/* Header chọn tất cả + nút xóa */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 12px;
  border-bottom: 1px solid #ddd;
}

.cart-header .left-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cart-header .right-tools {
  display: flex;
  gap: 10px;
}

.btn-action {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}
.btn-action:hover { background: #f0f0f0; }
.btn-action.danger {
  border-color: #ff4d4f;
  color: #ff4d4f;
}
.btn-action.danger:hover { background: #ffeaea; }
.btn-action.disabled,
.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Item */
.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.cart-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info { flex: 1; }
.price { font-weight: 600; }
.variant { font-size: 14px; color: #555; }

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
}
.quantity-wrapper button {
  width: 30px;
  height: 30px;
  font-size: 18px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  border-radius: 6px;
}
.remove-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 6px;
}
.remove-btn:hover { background: #d9363e; }

.item-checkbox {
  transform: scale(1.2);
  cursor: pointer;
}

/* Hàng tổng tiền + thanh toán (đường kẻ nhẹ phía trên) */
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;  /* đường kẻ nhẹ */
  padding-top: 12px;
  margin-top: 12px;
}

.total { font-size: 16px; }
.total strong { font-weight: 700; }
.total .hint { color: #777; font-size: 13px; margin-left: 6px; }

.checkout {
  background: #000;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.checkout:hover { background: #333; }

.clickable {
  cursor: pointer;
}
</style>
