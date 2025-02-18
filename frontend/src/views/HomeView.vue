<script setup>
import {onMounted} from 'vue'
import useAppStore from '@/stores/appStore'
import { useRouter } from 'vue-router'
import useUserService from '@/services/userService'
import useUserStore from '@/stores/userStore'

const router = useRouter()
const appStore = useAppStore()
const userService = useUserService()
const { getUser } = useUserStore()

onMounted(async () => {
  const loginSuccess = await userService.login()
  if (loginSuccess) {
    appStore.setAppMessage(200, 'Login success')
    router.replace({name: getUser().startRoute})
  }
})
</script>

<template>
  Bitte warten ...
</template>