import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import '@/style.css'
import 'primeicons/primeicons.css'

import ToastService from 'primevue/toastservice'

import moment from 'moment'
import 'moment/dist/locale/de.js'
import { extendMoment } from 'moment-range';

moment.locale('de')
extendMoment(moment)

import App from '@/App.vue'
import { router } from '@/routes.js'

createApp(App)
  .use(PrimeVue, {
    theme: {
        preset: Aura
    }
  })
  .use(router)
  .use(ToastService)
  .mount('#app')
