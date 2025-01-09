<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import fullcalendarDe from '@fullcalendar/core/locales/de'

import {inject} from 'vue'

import useCalendarService from '@/services/calendarService.js'
import moment from 'moment'
import useAppStore from '@/stores/appStore.js'

const appConfig = inject('config')

const appStore = useAppStore()
const calendarService = useCalendarService()

const today = moment()
const currentWeek = today.isoWeek()

const addEvent = (calendarApi, startDate, endDate, status) => {
  calendarApi.addEvent({
    id: startDate.format(appConfig.DATE_FORMAT),
    title: "Salat",
    start: startDate.format(appConfig.DATE_FORMAT),
    end: endDate.format(appConfig.DATE_FORMAT),
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
  weekNumbers: true,
  defaultAllDay: true,
  dayHeaderFormat: {
    weekday: 'long'
  },
  headerToolbar: {
    left: '',
    center: 'title',
    right: 'today prev,next'
  },
  dayCellClassNames: function (info) {
    const weekNumber = moment(info.date).isoWeek()
    if (weekNumber <= currentWeek) {
      return ['disallow-week']
    }

    const allowNextWeek = today.isoWeekday() < 5 && today.hour() > 12
    if(!allowNextWeek && weekNumber === currentWeek + 1) {
      return ['disallow-week']
    }

    return ['allow-week']
  },
  datesSet: async (info) => {
    const calenderApi = info.view.calendar

    calenderApi.removeAllEvents()
    const userEvents = await calendarService.getEvents(
        moment(info.start),
        moment(info.end)
    )

    userEvents.forEach(entry => {
      addEvent(calenderApi, entry.startDate, entry.endDate, entry.status)
    })
  },
  select: async (selectInfo) => {
    const calendarApi = selectInfo.view.calendar
    const weekNumber = moment(selectInfo.start).isoWeek()

    calendarApi.unselect()

    if (weekNumber < currentWeek) {
      alert('Kannste nicht ...')
      return
    }

    const startDate = moment(selectInfo.startStr)
    const endDate = moment(selectInfo.endStr)

    if (calendarApi.getEventById(startDate.format(appConfig.DATE_FORMAT)) instanceof Object) {
      alert('Hier hast Du dich bereits eingetragen!')
      return
    }

    const response = await calendarService.addEvent(startDate, endDate)
    if (response.status === 200) {
      addEvent(calendarApi, startDate, endDate, 'approved', true)
      appStore.setAppMessage(200, response.data.message)
    } else {
      appStore.setAppMessage(400, response.data.message)
    }
  }
}
</script>

<template>
  <FullCalendar ref="calendarContainer" :options="calendarOptions">
    <template #eventContent="arg">
      <strong>{{ arg.event.title }}</strong>
    </template>
  </FullCalendar>
</template>

<style>
.disallow-week {
  background-color: #f4e4a9;
}

.allow-week {
  background-color: #d1ffbf;
}

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