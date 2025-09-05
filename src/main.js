import { createApp } from 'vue'
import App from './App.vue'
import router from '../src/router/index'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
