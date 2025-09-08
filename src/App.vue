<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CategoryBar from './components/CategoryBar.vue'
import Banner from './components/Banner.vue'

const route = useRoute()

// Banner chỉ hiển thị khi không phải login/register
const showBanner = computed(() => {
  return !['Login', 'Register', 'VerifyOtp', 'ForgotPassword', 'Profile','ChangePassword'].includes(route.name)
})
</script>

<template>
  <div id="app">
    <Navbar />
    <Banner v-if="showBanner" />
    <CategoryBar />
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
  flex: 1;
  padding: 2rem;
  margin-top: 40px; /* nhường chỗ Navbar + CategoryBar */
}

footer {
  margin-top: auto;
}
</style>
