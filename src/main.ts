import { createApp } from 'vue'
import 'uno.css'

import { createPinia } from 'pinia'

import App from './App.vue'
import { router, setupRouter } from './router'
import './styles/index.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  await setupRouter()
  app.use(router)

  app.mount('#app')
}

void bootstrap()
