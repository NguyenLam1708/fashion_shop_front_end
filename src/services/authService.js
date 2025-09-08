import api from './api'

// Gọi API đăng ký
export const register = async (userData) => {
  const res = await api.post('/auth/register', userData)
  return res.data
}

// Gọi API đăng nhập
export const login = async (userData) => {
  const res = await api.post('/auth/login', userData)
  if (res.data?.data?.token) {
    localStorage.setItem('token', res.data.data.token)
    localStorage.setItem('userId', res.data.data.userId)
  }
  return res.data
}

// Gọi API xác thực OTP
export const verifyOtp = async (data) => {
  const res = await api.post('/auth/verify-otp', data)
  return res.data
}

// Gọi API gửi lại OTP
export const resendOtp = async (data) => {
  const res = await api.post('/auth/resend-otp', data)
  return res.data
}
