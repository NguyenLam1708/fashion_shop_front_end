<template>
  <header class="header">
    <router-link to="/" class="logo">
      <img src="/src/assets/logo.png" alt="Fashion Shop" />
    </router-link>
    <div class="search-bar">
      <input type="text" placeholder="Bạn đang tìm gì..." />
      <button class="search-btn">
        <i class="fas fa-search" style="color: #222"></i>
      </button>
    </div>
    <nav class="nav-right">
        <router-link to="/cart">
        <span class="icon">
          <i class="fas fa-shopping-cart"></i>
        </span>
        Giỏ hàng
      </router-link>
      <router-link to="/login">
        <span class="icon">
          <i class="fas fa-user"></i>
        </span>
        Đăng nhập
      </router-link>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 10vh;
  background: #fff; /* Đổi nền sang trắng */
  color: #222;      /* Đổi màu chữ sang đen/xám */
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}

.logo img {
  height: 100px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 8px #f39c12); /* Bóng vàng nhẹ cho logo */
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  max-width: 600px;
  margin: 0 2rem;
}

.search-bar input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px 0 0 8px;
  border: none;
  font-size: 1rem;
  outline: none;
  background: #f7f7f7; /* Nền input sáng nhẹ */
  color: #222;
}

.search-btn {
  border: 2px solid #f39c12;
  background: #fff;
  border-radius: 0 8px 8px 0;
  padding: 0 16px;
  cursor: pointer;
  height: 40px;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}


.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-right .icon {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
  vertical-align: middle;
}

.nav-right a {
  color: #222; /* Đổi màu chữ nav sang đen/xám */
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.nav-right a:hover {
  color: #f39c12; /* Màu vàng cam khi hover */
}
</style>
