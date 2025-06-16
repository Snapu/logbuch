import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'
import { useUserProfileStore } from './stores/userProfile'

const app = createApp(App)

app.use(
  createVuetify({
    components,
    directives,
  }),
)
app.use(createPinia())
app.use(router)

app.mount('#app')

const userProfileStore = useUserProfileStore()
if (!userProfileStore.setupCompleted) {
  router.push('/setup')
}
