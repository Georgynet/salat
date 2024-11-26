<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import de from '@fullcalendar/core/locales/de'

import {onMounted, ref, useTemplateRef} from 'vue'

import useCalendarService from '@/services/calendarService.js'

const calendarService = useCalendarService()

const events = ref([])
const calendarContainer = useTemplateRef('calendarContainer')

const addEvent = (calendarApi, startDate, endDate, status) => {
  calendarApi.addEvent({
    title: "Salat",
    start: startDate,
    end: endDate,
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
  locale: de,
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

    const isEventAdded = await calendarService.addEvent(selectInfo.startStr, selectInfo.endStr)
    if (isEventAdded) {
      addEvent(calendarApi, selectInfo.startStr, selectInfo.endStr, 'approved')
    }
  },
  eventsSet: (calendarEvents) => {
    events.value = calendarEvents
  }
}

onMounted(async () => {
  const calendar = calendarContainer.value.getApi()

  const userEvents = await calendarService.getEvents()
  userEvents.forEach(entry => {
    addEvent(calendar, entry.date, entry.date, entry.status)
  })
})
</script>

<template>
  <FullCalendar ref="calendarContainer" :options="calendarOptions">
    <template #eventContent="arg">
      <strong>{{ arg.event.title }}</strong>
    </template>
  </FullCalendar>

  {{ events }}
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