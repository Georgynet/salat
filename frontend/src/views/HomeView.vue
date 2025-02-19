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
    window.setTimeout(() => {
      router.replace({name: getUser().startRoute})
    }, 1000)
  }
})
</script>

<template>
  <div class="text-center">
    <div class="my-4">
      <span class="pi pi-spin pi-spinner !text-4xl"></span>
    </div>
    Bitte warten ...<br />
    Du wirst eingeloggt.
  </div>
</template>