import api from './api';

// Lấy danh sách category với phân trang
export const getAllCategories = (page = 1, limit = 10) => {
  return api.get('/category', {
    params: { page, limit }
  });
};

// Tạo category mới
export const createCategory = (name) => {
  return api.post('/categories', { name });
};

// Cập nhật category
export const updateCategory = (categoryId, name) => {
  return api.put(`/categories/${categoryId}`, { name });
};

// Xóa category
export const deleteCategory = (categoryId) => {
  return api.delete(`/categories/${categoryId}`);
};
