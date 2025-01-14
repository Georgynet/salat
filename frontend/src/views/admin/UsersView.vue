<script setup>
import moment from 'moment'
import {inject, onMounted, ref} from 'vue'
import useUsersService from '@/services/usersService.js'
import { useToast } from 'primevue/usetoast'

import DatePicker from 'primevue/datepicker'
import DaySelect from '@/components/DaySelect.vue'

const usersService = useUsersService()
const toast = useToast()

const appConfig = inject('config')

const entries = ref([])
const users = ref([])

const loading = ref(true)
const editMode = ref(false)

const startDate = ref(moment().startOf('week'))
const endDate = ref(moment().endOf('week'))
const dateRange = ref(moment.range(startDate.value, endDate.value))

const loadTable = async () => {
  loading.value = true

  entries.value = await usersService.fetchUserEntries(
      startDate.value,
      endDate.value,
  )

  loading.value = false
}

const updateDateRange = async (start, end) => {
  startDate.value = start.startOf('week')
  endDate.value = end.endOf('week')
  dateRange.value = moment.range(startDate.value, endDate.value)
  editMode.value = false
  await loadTable()
}

const dayEntry = (day, userId) => {
  const entry = entries.value.get(day.format(appConfig.DATE_FORMAT) + '_' + userId)
  if (entry !== undefined) {
    return entry
  }

  return null
}

const changeUserDayStatus = async (data) => {
  const changed = await usersService.changeEntryStatus(data.id, data.status)
  if (changed) {
    toast.add({severity: 'success', summary: 'Status changed ...', life: 2000})
  }
}

const dates = ref([
    startDate.value.toDate(),
    endDate.value.toDate()
])

const changeDates = () => {
  const hasBothDays = dates.value.indexOf(null) === -1
  if (hasBothDays) {
    updateDateRange(moment(dates.value[0]), moment(dates.value[1]))
  }
}

onMounted(async () => {
  const usersMap = await usersService.fetchUsers()
  users.value = Array.from(usersMap.entries()).map(([id, user]) => ({ id, ...user }))

  await loadTable()
})
</script>

<template>
  <h1 v-if="!editMode" @click="editMode = !editMode" class="text-xl font-bold text-center m-4">
    {{ startDate.format(appConfig.VIEW_DATE_FORMAT) }} bis {{ endDate.format(appConfig.VIEW_DATE_FORMAT) }}
    <i class="pi pi-pencil" style="font-size: 1rem"></i>
  </h1>
  <div v-else class="text-center">
    <DatePicker
        v-model="dates"
        selectionMode="range"
        dateFormat="dd.mm.yy"
        :showButtonBar="true"
        :selectOtherMonths="true"
        :disabledDays="[0, 6]"
        :showWeek="true"
        :manualInput="false"
        @date-select="changeDates"
    />

    <div class="text-gray-500 mt-2 mb-6 text-xs">
      Der ausgesuchte Bereich aktualisiert sich automatisch auf die vollen Kalenderwochen!
    </div>
  </div>

  <table class="mx-auto table-auto mb-4" v-if="!loading" v-for="week in dateRange.by('weeks')">
    <thead>
      <tr>
        <th colspan="6">KW{{ week.isoWeek() }}</th>
      </tr>
      <tr class="border">
        <th class="bg-gray-300 px-2 py-1 w-[200px]">User</th>
        <th
            class="bg-gray-300 px-2 py-1 w-[200px]"
            v-for="day in moment.range(week.clone().startOf('week'), week.clone().endOf('week').subtract(2, 'day')).by('day')"
        >
          {{ day.format(appConfig.VIEW_DATE_FORMAT) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b" v-for="user in users" :key="user.id">
        <td class="px-2 py-1 w-[200px] border-l">{{ user.username }}</td>
        <td
            class="px-2 py-1 w-[200px] border-l border-r text-center"
            v-for="day in moment.range(week.clone().startOf('week'), week.clone().endOf('week').subtract(2, 'day')).by('day')"
        >
          <day-select v-bind="dayEntry(day, user.id)" @change="changeUserDayStatus" />
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else>
    Loading ...
  </div>
</template>