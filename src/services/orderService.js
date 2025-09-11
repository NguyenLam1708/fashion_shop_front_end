import api from "./api"; 

// Tạo đơn hàng COD
export const createOrderCOD = (shippingAddress, selectedItems) => {
  return api.post("/orders/cod", {
    shippingAddress,
    selectedItems,
  });
};

// Lấy danh sách đơn hàng của user có phân trang
export const getOrders = (page = 1, limit = 10) => {
  return api.get(`/orders/me?page=${page}&limit=${limit}`);
};

// Lấy chi tiết đơn hàng theo id
export const getOrderById = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

// Hủy đơn hàng (user)
export const cancelOrder = (orderId) => {
  return api.put(`/orders/${orderId}/cancel`);
};

// Admin: lấy tất cả đơn hàng
export const getAllOrders = (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({ page, limit, ...filters }).toString();
  return api.get(`/orders/?${params}`);
};

// Admin cập nhật đơn hàng
export const updateOrder = (orderId, status, paymentStatus) => {
  return api.put(`/orders/${orderId}`, {
    status,
    paymentStatus,
  });
};
