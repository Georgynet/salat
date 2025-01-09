<script setup>
import {ref, inject} from 'vue'
import Select from 'primevue/select'

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

const changeDayStatus = () => {
  emit('change', {
    index: props.day.format(appConfig.DATE_FORMAT) + '_' + props.userId,
    userId: props.userId,
    day: props.day,
    status
  })
}

const status = ref(props.status)

const options = [
  {"status": "---", "value": "noentry"},
  {"status": "rejected", "value": "rejected"},
  {"status": "reserved", "value": "reserved"},
  {"status": "approved", "value": "approved"}
]
</script>

<template>
  <div>
    <Select v-model="status" :options="options" option-label="status" option-value="value" size="small" @change="changeDayStatus"></Select>
  </div>

</template>

<style scoped>

</style>