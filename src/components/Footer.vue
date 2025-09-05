<template>
  <footer class="footer">
    <div class="newsletter">
      <div class="social-icons">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
    <hr />
    <div class="footer-content">
      <div class="footer-col">
        <h4>GIỚI THIỆU</h4>
        <p>FashionShop - Chuỗi Phân Phối Thời Trang Nam Chuẩn Hiệu</p>
        <p><i class="fas fa-phone"></i> 0362651806</p>
        <p><i class="fas fa-envelope"></i> lam170804@gmail.com</p>
        <p><i class="fas fa-clock"></i> Giờ mở cửa: 08:30 - 22:00</p>
        <p><i class="fas fa-headset"></i> Tư vấn đến 24:00 (Mỗi ngày)</p>
      </div>
      <div class="footer-col">
        <h4>CHÍNH SÁCH</h4>
        <ul>
          <li><a href="#">Hướng dẫn đặt hàng</a></li>
          <li><a href="#">Chính sách</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>ĐỊA CHỈ CỬA HÀNG</h4>
        <p><i class="fas fa-map-marker-alt"></i> Hồ Chí Minh (12 CH): 297/3 Tô Hiến Thành, Phường Hòa Hưng, TP.HCM</p>
        <p><i class="fas fa-map-marker-alt"></i> Hà Nội (2 CH): 26 Phố Lê Đại Hành, Hai Bà Trưng, TP.HN</p>
        <p><i class="fas fa-map-marker-alt"></i> Cần Thơ (2 CH): 35 Trần Phú, Ninh Kiều, TP.CT</p>
        <p><i class="fas fa-map-marker-alt"></i> Đà Nẵng (2 CH): 332 Đ. Lê Duẩn, Thanh Khê, TP.ĐN </p>
        <a href="#" class="all-store">Xem tất cả cửa hàng</a>
      </div>
      <div class="footer-col">
        <h4>PHƯƠNG THỨC THANH TOÁN</h4>
        <div class="payment-methods">
          <span>VNPay</span>
          <span>COD</span>
        </div>
      </div>
    </div>
    <p class="footer-bottom">BẢN QUYỀN THUỘC VỀ FashionShop</p>
  </footer>
</template>

<style scoped>

.footer {
  background: #0d0d0d;
  color: #e0e0e0;
  padding: 48px 20px 16px;
  font-size: 15px;
}

.newsletter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.social-icons {
  display: flex;
  gap: 12px;
}
.social-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1a1a1a;
  color: #e0e0e0;
  font-size: 16px;
  transition: all 0.3s ease;
}
.social-icons a:hover {
  background: #3498db;
  color: #fff;
  transform: translateY(-3px);
}

hr {
  border: none;
  border-top: 1px solid #333;
  margin: 20px 0 28px 0;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 32px;
}

.footer-col h4 {
  margin-bottom: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  border-left: 3px solid #3498db;
  padding-left: 8px;
}

.footer-col p,
.footer-col ul li a {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #bbb;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-col ul li {
  margin-bottom: 8px;
}
.footer-col ul li a {
  text-decoration: none;
  transition: color 0.3s ease;
}
.footer-col ul li a:hover {
  color: #fff;
}

.payment-methods {
  display: flex;
  gap: 14px;
  margin-top: 10px;
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
}

.all-store {
  display: inline-block;
  margin-top: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;
}
.all-store:hover {
  color: #fff;
}

.footer-bottom {
  text-align: center;
  font-size: 13px;
  border-top: 1px solid #222;
  padding-top: 14px;
  margin-top: 28px;
  letter-spacing: 1px;
  color: #888;
}

</style>
