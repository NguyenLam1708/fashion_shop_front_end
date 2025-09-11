import api from './api'

// Tạo sản phẩm mới
export const createProduct = async (formData) => {
  const res = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

// Lấy danh sách sản phẩm (có phân trang)
export const getAllProducts = async (page = 1, limit = 10) => {
  const res = await api.get(`/products?page=${page}&limit=${limit}`)
  return res.data
}

// Lấy chi tiết 1 sản phẩm theo ID
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`)
  return res.data
}

// Lấy sản phẩm theo categoryId
export const getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
  const res = await api.get(`/products/category/${categoryId}`, {
    params: { page, limit }
  })
  return res.data
}

// Xoá sản phẩm
export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`)
  return res.data
}

export const updateProduct = async (id, formData) => {
  const res = await api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}
