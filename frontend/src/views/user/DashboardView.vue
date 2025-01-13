<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import fullcalendarDe from '@fullcalendar/core/locales/de'

import {inject} from 'vue'


import {useConfirm} from 'primevue/useconfirm'
import useCalendarService from '@/services/calendarService.js'
import moment from 'moment'
import useAppStore from '@/stores/appStore.js'

const appConfig = inject('config')

const appStore = useAppStore()
const calendarService = useCalendarService()
const confirm = useConfirm()

const today = moment()
const currentWeek = today.isoWeek()

const addEvent = (calendarApi, id, startDate, endDate, status) => {
  calendarApi.addEvent({
    id: id,
    title: "Salat",
    start: startDate.format(appConfig.DATE_FORMAT),
    end: endDate.format(appConfig.DATE_FORMAT),
    classNames: ['event-' + status],
    allDay: false
  })
}

const removeEvent = async (eventId) => {
  const eventIdAsNumber = Number(eventId);
  return await calendarService.removeEvent(eventIdAsNumber);
}

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  selectable: true,
  eventClick: async (info) => {
    const eventId = info.event.id,
        response = await removeEvent(eventId);

    if (response.status === 200) {
      info.event.remove();
      appStore.setAppMessage(200, 'This entry is successfully deleted')
    } else {
      appStore.setAppMessage(400, 'You can not remove past or this week entries');
    }
  },
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
    if (!allowNextWeek && weekNumber === currentWeek + 1) {
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
      addEvent(calenderApi, entry.id, entry.startDate, entry.endDate, entry.status)
    })
  },

  select: async (selectInfo) => {
    const calendarApi = selectInfo.view.calendar,
        weekNumber = moment(selectInfo.start).isoWeek(),
        currentDayOfWeek = today.isoWeekday()

    calendarApi.unselect()

    if (weekNumber < currentWeek || (weekNumber === currentWeek && currentDayOfWeek >= 5 && currentDayOfWeek <= 7)) {
      confirm.require({
        message: 'Entry is no longer possible this week.',
        header: 'Not possible',
        acceptLabel: 'Ok',
        rejectClass: '!hidden'
      })
      return
    }

    const startDate = moment(selectInfo.startStr),
        endDate = moment(selectInfo.endStr)

    if (calendarApi.getEventById(startDate.format(appConfig.DATE_FORMAT)) instanceof Object) {
      confirm.require({
        message: 'You have already made an entry on this day.',
        header: 'Duplicate entry',
        acceptLabel: 'Ok',
        rejectClass: '!hidden'
      })
      return
    }

    const response = await calendarService.addEvent(startDate, endDate)

    if (response.status === 200) {
      response.data.calendarEntries.forEach(entry => {
        addEvent(calendarApi, entry.id, moment(entry.date), moment(entry.date).add(1, 'd'), entry.status)
      })

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