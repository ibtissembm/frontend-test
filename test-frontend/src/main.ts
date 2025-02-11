import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.scss' // ✅ Assurez-vous que ce chemin est correct

const app = createApp(App)
app.use(router)
app.mount('#app')
