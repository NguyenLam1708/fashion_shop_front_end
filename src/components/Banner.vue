<template>
  <div class="banner-slider">
    <!-- Slides -->
    <div class="slides" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div class="slide" v-for="(img, index) in images" :key="index">
        <img :src="img" alt="banner" />
      </div>
    </div>

    <!-- Nút mũi tên -->
    <button class="arrow left" @click="prevSlide">&#10094;</button>
    <button class="arrow right" @click="nextSlide">&#10095;</button>

    <!-- Indicator dots -->
    <div class="dots">
      <span 
        v-for="(img, index) in images" 
        :key="index" 
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const images = [
  '/src/assets/banner1.jpg',
  '/src/assets/banner2.jpg',
  '/src/assets/banner3.jpg'
]

const currentIndex = ref(0)
let interval = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

onMounted(() => {
  interval = setInterval(nextSlide, 3000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.banner-slider {
  width: 100%;
  height: 450px;
  overflow: hidden;
  position: relative;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

/* Slides */
.slides {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide img {
  width: 100%;
  height: 80%;
  object-fit: contain;
}

/* Mũi tên màu đen, không background */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  color: black; /* màu chữ đen */
  font-size: 2rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  user-select: none;
  z-index: 10;
}

.arrow.left {
  left: 10px;
}

.arrow.right {
  right: 10px;
}

/* Indicator dots */
.dots {
  position: absolute;
  bottom: 15px;
  width: 100%;
  text-align: center;
  z-index: 10;
}

.dots span {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin: 0 5px;
  background-color: white; /* dot bình thường nền trắng */
  border: 2px solid black; /* viền đen */
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.dots span.active {
  background-color: black; /* dot active màu đen */
  border: 2px solid black; /* viền vẫn đen */
}

</style>
