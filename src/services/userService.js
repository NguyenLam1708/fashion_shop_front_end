import api from './api' 
// Lấy thông tin user hiện tại
export const getMe = () => {
  return api.get('/users/my-info')
}

// Lấy thông tin user theo ID
export const getUserById = (id) => {
  return api.get(`/users/${id}`)
}

// Đổi mật khẩu
export const changePassword = (oldPassword, newPassword, confirmPassword) => {
  return api.patch('/users/change-password', {
    oldPassword,
    newPassword,
    confirmPassword
  })
}

// Đổi thông tin cá nhân
export const changeInfo = (data) => {
  return api.put('/users/change-info', data)
}

// Quên mật khẩu
export const forgotPassword = (email) => {
  return api.post('/users/forgot-password', { email })
}

// Lấy danh sách user (admin)
export const getAllUsers = (page = 1, limit = 10) => {
  return api.get('/users', {
    params: { page, limit }
  })
}

// Cập nhật user (admin)
export const updateUser = (id, data) => {
  return api.put(`/users/${id}`, data)
}
