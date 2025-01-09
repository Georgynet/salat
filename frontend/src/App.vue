<script setup>
import { provide } from 'vue'
import Menubar from 'primevue/menubar'
import AppMessage from '@/components/AppMessage.vue'
import { getRoutes } from '@/routes.js'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

provide('config', {
  VIEW_DATE_FORMAT: 'DD.MM.YYYY',
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD\\THH:mm:ss\\Z'
})
</script>

<template>
  <div class="container mt-10 mx-5 md:mx-auto">
    <h1 class="text-3xl font-bold mb-4 text-center">
      SalatBar App
    </h1>

    <Menubar :model="getRoutes" class="mb-4">
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
