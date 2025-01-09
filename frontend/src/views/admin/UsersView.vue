<script setup>
import moment from 'moment'
import useUsersService from '@/services/usersService.js'
import {inject, onMounted, ref} from 'vue'

const usersService = useUsersService()

const entries = ref([])
const users = ref([])

const loading = ref(true)

const startDate = moment().subtract(1, 'week').startOf('week')
const endDate = moment().add(1, 'week').endOf('week')

const dateRange = moment.range(startDate, endDate)

const appConfig = inject('config')

onMounted(async () => {
  const usersMap = await usersService.fetchUsers()
  users.value = Array.from(usersMap.entries()).map(([id, user]) => ({ id, ...user }))

  entries.value = await usersService.fetchUserEntries(
      startDate,
      endDate,
  )

  loading.value = false
})

const dayEntry = (day, userId) => {
  const entry = entries.value.get(day.format(appConfig.DATE_FORMAT) + '_' + userId)
  if (entry !== undefined) {
    return entry.status
  }

  return '---'
}

</script>

<template>
  <h1 class="text-xl font-bold text-center m-4">{{ startDate.format(appConfig.VIEW_DATE_FORMAT) }} bis {{ endDate.format(appConfig.VIEW_DATE_FORMAT) }}</h1>

  <table class="mx-auto table-auto mb-4" v-if="!loading" v-for="week in dateRange.by('weeks')">
    <thead>
      <tr>
        <th colspan="6">KW{{ week.isoWeek() }}</th>
      </tr>
      <tr class="border">
        <th class="bg-gray-300 px-4 py-2 w-[200px]">User</th>
        <th class="bg-gray-300 px-4 py-2 w-[200px]" v-for="day in moment.range(week.clone().startOf('week'), week.clone().endOf('week').subtract(2, 'day')).by('day')">
          {{ day.format(appConfig.VIEW_DATE_FORMAT) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b" v-for="user in users" :key="user.id">
        <td class="px-4 py-2 w-[200px] border-l">{{ user.username }}</td>
        <td class="px-4 py-2 w-[200px] border-l border-r text-center" v-for="day in moment.range(week.clone().startOf('week'), week.clone().endOf('week').subtract(2, 'day')).by('day')">
          {{ dayEntry(day, user.id) }}
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else>
    Loading ...
  </div>
</template>

<style scoped>

</style>