import { createApp } from 'vue'
import App from './App.vue'
import router from '../src/router/index'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.css';
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import "element-plus/dist/index.css"

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Toast)
app.mount('#app')
