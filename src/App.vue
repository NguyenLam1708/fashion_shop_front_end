<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div id="app">
    <Navbar />
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style>
.main {
  padding: 2rem;
  margin-top: 70px; /* đẩy nội dung xuống dưới header */
}
</style>
