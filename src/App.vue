<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/footer.vue'
</script>

<template>
  <div id="app">
    <Navbar />
    <main class="main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1; /* nội dung chiếm hết khoảng trống, đẩy footer xuống đáy */
  padding: 2rem;
  margin-top: 70px; /* giữ khoảng trống cho header */
}

footer {
  margin-top: auto;
}
</style>
