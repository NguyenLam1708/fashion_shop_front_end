<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import Navbar from "./components/Navbar.vue"
import Footer from "./components/Footer.vue"
import CategoryBar from "./components/CategoryBar.vue"
import Banner from "./components/Banner.vue"

const route = useRoute()

// Các trang không hiển thị Banner
const showBanner = computed(() => {
  return ![
    "Login", "Register", "VerifyOtp", "ForgotPassword",
    "Profile", "ChangePassword", "Cart", "Orders", "Dashboard"
  ].includes(route.name)
})

// Các trang không dùng layout mặc định (vd: Dashboard)
const useDefaultLayout = computed(() => {
  return !["Dashboard"].includes(route.name)
})
</script>

<template>
  <div id="app">
    <!-- Layout mặc định -->
    <template v-if="useDefaultLayout">
      <Navbar />
      <Banner v-if="showBanner" />
      <CategoryBar />
      <main class="main">
        <router-view />
      </main>
      <Footer />
    </template>

    <!-- Layout đặc biệt (dashboard) -->
    <template v-else>
      <router-view />
    </template>
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
  margin-top: 40px;
}

footer {
  margin-top: auto;
}
</style>
