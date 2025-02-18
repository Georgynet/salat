<script setup>
import {onMounted, ref} from 'vue'
import useAppStore from '@/stores/appStore'
import { useRouter } from 'vue-router'
import useUserService from '@/services/userService'
import useUserStore from '@/stores/userStore'

import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Card from 'primevue/card'

const router = useRouter()
const userService = useUserService()

onMounted(async () => {
  await userService.login()
  appStore.setAppMessage(200, 'Login success')
  router.replace({name: getUser().startRoute})
})
</script>

<template>
  Bitte warten ...
</template>