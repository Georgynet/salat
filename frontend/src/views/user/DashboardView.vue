<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import fullcalendarDe from '@fullcalendar/core/locales/de'

import {onMounted, useTemplateRef} from 'vue'

import useCalendarService from '@/services/calendarService.js'
import moment from "moment";

const calendarService = useCalendarService()
const calendarContainer = useTemplateRef('calendarContainer')

const addEvent = (calendarApi, startDate, endDate, status) => {
  calendarApi.addEvent({
    id: startDate.format('YYYY-MM-DD'),
    title: "Salat",
    start: startDate.format('YYYY-MM-DD'),
    end: endDate.format('YYYY-MM-DD'),
    classNames: ['event-' + status],
    allDay: true
  })
}

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  selectable: true,
  hiddenDays: [0, 6],
  firstDay: 1,
  locale: fullcalendarDe,
  defaultAllDay: true,
  dayHeaderFormat: {
    weekday: 'long'
  },
  headerToolbar: {
    left: '',
    center: 'title',
    right: 'today prev,next'
  },
  eventClick: (info) => {
    info.el.style.borderColor = 'red';
  },
  select: async (selectInfo) => {
    const calendarApi = selectInfo.view.calendar
    calendarApi.unselect()

    const startDate = moment(selectInfo.startStr)
    const endDate = moment(selectInfo.endStr)

    if (calendarApi.getEventById(startDate.format('YYYY-MM-DD')) instanceof Object) {
      alert('Hier hast Du dich bereits eingetragen!')
      return
    }

    const isEventAdded = await calendarService.addEvent(startDate, endDate)
    if (isEventAdded) {
      addEvent(calendarApi, startDate, endDate, 'reserved', true)
    }
  }
}

onMounted(async () => {
  const calendar = calendarContainer.value.getApi()

  const userEvents = await calendarService.getEvents()
  userEvents.forEach(entry => {
    addEvent(calendar, entry.startDate, entry.endDate, entry.status)
  })
})
</script>

<template>
  <FullCalendar ref="calendarContainer" :options="calendarOptions">
    <template #eventContent="arg">
      <strong>{{ arg.event.title }}</strong>
    </template>
  </FullCalendar>
</template>

<style>
.event-approved {
  background-color: #4faa2f;
}

.event-rejected {
  background-color: #aa2f2f;
}

.event-reserved {
  background-color: #baa71b;
}
</style>