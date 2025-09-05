import api from './api'

// Tạo sản phẩm mới
export const createProduct = async (productData, files) => {
  const formData = new FormData()
  for (const key in productData) {
    formData.append(key, productData[key])
  }
  if (files && files.length > 0) {
    files.forEach(file => formData.append('files', file))
  }
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
export const getProductsByCategory = async (categoryId) => {
  const res = await api.get(`/products/category/${categoryId}`)
  return res.data
}

// Xoá sản phẩm
export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`)
  return res.data
}

// Cập nhật sản phẩm
export const updateProduct = async (id, productData, files) => {
  const formData = new FormData()
  for (const key in productData) {
    formData.append(key, productData[key])
  }
  if (files && files.length > 0) {
    files.forEach(file => formData.append('files', file))
  }
  const res = await api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}
