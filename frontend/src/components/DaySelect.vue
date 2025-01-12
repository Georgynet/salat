<script setup>
import {ref, inject} from 'vue'
import Select from 'primevue/select'
import Chip from 'primevue/chip'

const appConfig = inject('config')

const emit = defineEmits(['change'])

const props = defineProps({
  status: {
    type: String,
    default: 'noentry'
  },
  day: {
    type: Object
  },
  userId: {
    type: Number
  }
})

const status = ref(props.status)
const editMode = ref(false)

const changeDayStatus = () => {
  editMode.value = false
  emit('change', {
    index: props.day.format(appConfig.DATE_FORMAT) + '_' + props.userId,
    userId: props.userId,
    day: props.day,
    status: status.value
  })
}

const options = [
  {"status": appConfig.calendar.statusText.noentry, "value": appConfig.calendar.status.noentry},
  {"status": appConfig.calendar.statusText.rejected, "value": appConfig.calendar.status.rejected},
  {"status": appConfig.calendar.statusText.reserved, "value": appConfig.calendar.status.reserved},
  {"status": appConfig.calendar.statusText.approved, "value": appConfig.calendar.status.approved}
]

const classForStatus = () => {
  return {
    'text-gray-700': status.value === appConfig.calendar.status.noentry,
    'text-green-700': status.value === appConfig.calendar.status.approved,
    'text-red-700': status.value === appConfig.calendar.status.rejected,
    'text-amber-700': status.value === appConfig.calendar.status.reserved,
  }
}
</script>

<template>
  <div>
    <Chip v-if="!editMode" @click="editMode=!editMode">
      <span :class="classForStatus()">{{ status }}</span>
      <i class="pi pi-pencil" style="font-size: 1rem"></i>
    </Chip>
    <Select v-else v-model="status" :options="options" option-label="status" option-value="value" size="small" @change="changeDayStatus"></Select>
  </div>

</template>

<style scoped>

</style>