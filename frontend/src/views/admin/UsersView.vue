<script setup>
import moment from 'moment'
import useUsersService from '@/services/usersService.js'
import {onMounted, ref} from 'vue'

const usersService = useUsersService()

const entries = ref([])
const users = ref([])

const startDate = moment().subtract(1, 'week').startOf('week')
const endDate = moment().add(1, 'week').endOf('week')

const dateRange = moment.range(startDate, endDate)

onMounted(async () => {
  const usersMap = await usersService.fetchUsers()
  users.value = Array.from(usersMap.entries()).map(([id, user]) => ({ id, ...user }))

  entries.value = await usersService.fetchUserEntries(
      startDate,
      endDate,
  )
})

</script>

<template>
  <h1 class="text-xl font-bold">{{ startDate.format('DD.MM.YYYY') }} bis {{ endDate.format('DD.MM.YYYY') }}</h1>
  <table class="mb-4" v-for="week in dateRange.by('weeks')">
    <thead>
      <tr>
        <th colspan="6">KW{{ week.isoWeek() }}</th>
      </tr>
      <tr>
        <th class="bg-gray-300 px-4 py-2 w-[200px]">User</th>
        <th class="bg-gray-300 px-4 py-2 w-[200px]" v-for="day in moment.range(week.clone().startOf('week'), week.clone().endOf('week').subtract(2, 'day')).by('day')">
          {{ day.format('DD.MM.YYYY') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b" v-for="user in users" :key="user.id">
        <td class="px-4 py-2 w-[200px]">{{ user.username }}</td>
        <td class="px-4 py-2 w-[200px] border-l border-r text-center" v-for="day in moment.range(week.clone().startOf('week'), week.clone().endOf('week').subtract(2, 'day')).by('day')">

        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>

</style>