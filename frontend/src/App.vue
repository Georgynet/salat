<script setup>
import {onMounted, provide, ref} from 'vue'
import Menubar from 'primevue/menubar'
import AppMessage from '@/components/AppMessage.vue'
import { getRoutes } from '@/routes.js'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import useAppStore from '@/stores/appStore.js'

const appStore = useAppStore()

provide('config', {
  VIEW_DATE_FORMAT: 'DD.MM.YYYY',
  VIEW_DATE_WITH_WEEKDAY_FORMAT: 'ddd DD.MM.YYYY',
  VIEW_MONTH_FORMAT: 'MMMM YYYY',
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD\\THH:mm:ss\\Z',
  calendar: {
    status: {
      noentry: 'noentry',
      rejected: 'rejected',
      approved: 'approved',
      reserved: 'reserved',
    },
    statusText: {
      noentry: '---',
      rejected: 'rejected',
      approved: 'approved',
      reserved: 'reserved',
    }
  }
})

const routes = ref({})

onMounted(() => {
  routes.value = getRoutes()
  if (appStore.isDarkModeEnabled.value) {
    appStore.enableDarkMode()
  }
})
</script>

<template>
  <div class="container p-2 xl:mt-10 md:mx-auto">
    <button label="Toggle Dark Mode" class="float-right" @click="appStore.toggleDarkMode()">
      <i class="pi" :class="{'pi-moon': !appStore.isDarkModeEnabled.value, 'pi-sun': appStore.isDarkModeEnabled.value}"></i>
    </button>

    <h1 class="text-3xl font-bold mb-4 text-center">
      SalatBar App
    </h1>

    <Menubar :model="routes" class="mb-4" v-if="Object.values(routes).length > 1">
      <template #item="{ item, props }">
        <router-link v-slot="{ href, navigate }" :to="{ name: item.name }">
          <a :href="href" v-bind="props.action" @click="navigate">
            <span class="ml-2">{{ item.meta.label }}</span>
          </a>
        </router-link>
      </template>
    </Menubar>

    <Toast />
    <ConfirmDialog />
    <AppMessage />

    <RouterView />
  </div>
</template>