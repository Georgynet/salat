<script setup>
import {onMounted} from 'vue'
import { useRouter } from 'vue-router'
import useUserService from '@/services/userService'
import useUserStore from '@/stores/userStore'

const router = useRouter()
const userService = useUserService()
const { getUser } = useUserStore()

onMounted(async () => {
  await userService.login()
  appStore.setAppMessage(200, 'Login success')
  router.replace({name: getUser().startRoute})
})
</script>

<template>
  Bitte warten ...
</template>