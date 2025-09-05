<template>
  <footer class="footer">
    <div class="footer-content">
      <div>
        <h3>FashionShop</h3>
        <p>Thời trang phong cách, giá hợp lý.</p>
      </div>
      <div>
        <h4>Thông tin</h4>
        <ul>
          <li><a href="#">Về chúng tôi</a></li>
          <li><a href="#">Chính sách đổi trả</a></li>
          <li><a href="#">Chính sách bảo hành</a></li>
        </ul>
      </div>
      <div>
        <h4>Liên hệ</h4>
        <p>Email: support@fashionshop.com</p>
        <p>Hotline: 0123 456 789</p>
      </div>
    </div>
    <p class="footer-bottom">© 2025 FashionShop. All rights reserved.</p>
  </footer>
</template>

<style scoped>
.footer {
  background: #111;
  color: #fff;
  padding: 30px 20px;
}
.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.footer-content h3, .footer-content h4 {
  margin-bottom: 10px;
}
.footer-content ul {
  list-style: none;
  padding: 0;
}
.footer-content ul li a {
  color: #bbb;
  text-decoration: none;
}
.footer-content ul li a:hover {
  color: #fff;
}
.footer-bottom {
  text-align: center;
  font-size: 14px;
  border-top: 1px solid #333;
  padding-top: 10px;
}
</style>
