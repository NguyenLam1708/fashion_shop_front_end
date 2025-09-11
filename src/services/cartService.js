// src/services/cartService.js
import api from './api';

// Lấy giỏ hàng
export const getCart = () => {
  return api.get('/cart');
};

// Thêm sản phẩm vào giỏ
export const addToCart = (productId, quantity) => {
  return api.post('/cart', { productId, quantity });
};

// Cập nhật số lượng sản phẩm
export const updateQuantity = (productId, quantity) => {
  return api.put(`/cart/${productId}`, { quantity });
};

// Xóa 1 sản phẩm khỏi giỏ (đúng path /cart/item/:productId)
export const removeFromCart = (productId) => {
  return api.delete(`/cart/item/${productId}`);
};

// Xóa toàn bộ giỏ hàng (đúng path /cart/clear)
export const clearCart = () => {
  return api.delete('/cart/clear');
};
