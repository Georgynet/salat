import {createApp} from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import primeVueLocale from 'primelocale/de.json'

import '@/style.css'
import 'primeicons/primeicons.css'

import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import moment from 'moment'
import 'moment/dist/locale/de.js'
import {extendMoment} from 'moment-range';

moment.locale('de')
extendMoment(moment)

import useUserStore from '@/stores/userStore.js'
import App from '@/App.vue'
import {router} from '@/routes.js'

const {setUserToken} = useUserStore()
setUserToken(localStorage.getItem('token') ?? null)

createApp(App)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        },
        locale: primeVueLocale.de
    })
    .use(router)
    .use(ToastService)
    .use(ConfirmationService)
    .mount('#app')
