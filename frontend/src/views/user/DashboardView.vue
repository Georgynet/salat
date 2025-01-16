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

const getTooltipMessage = (classNames) => {
  if (classNames.includes('event-approved')) {
    return 'Dein Eintrag wurde genehmigt. Guten Appetit!:)';
  } else if (classNames.includes('event-rejected')) {
    return 'Dein Eintrag wurde abgelehnt. Trag dich nächstes Mal rechtzeitig ein.';
  } else if (classNames.includes('event-reserved')) {
    return 'Dein Eintrag wurde reserviert. Wir schauen, ob es genug Proviant für alle gibt. Trag dich nächstes Mal rechtzeitig ein.';
  }
  return 'Keine Information verfügbar.';
}

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  selectable: true,
  eventClick: (info) => {
    const eventId = info.event.id,
        weekNumber = moment(info.event.start).isoWeek(),
        currentWeek = moment().isoWeek();

    if (weekNumber === currentWeek) {
      appStore.setAppMessage(400, 'Die Einträge dieser Woche können nicht gelöscht werden');
      return;
    }

    confirm.require({
      message: 'Bist du dir sicher, dass du diesen Eintrag löschen möchtest?',
      header: 'Eintrag löschen',
      acceptLabel: 'Löschen',
      rejectLabel: 'Abbrechen',
      accept: async () => {
        const response = await removeEvent(eventId);

        if (response.status === 200) {
          info.event.remove();
          appStore.setAppMessage(200, 'Dieser Eintrag wurde erfolgreich gelöscht.');
        } else {
          appStore.setAppMessage(400, 'Es können keine Einträge aus der Vergangenheit oder dieser Woche gelöscht werden');
        }
      },

      reject: () => appStore.setAppMessage(400, 'Löschung abgebrochen'),
      rejectClass: 'p-button-secondary'
    });
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
        currentWeek = moment().isoWeek(),
        currentDayOfWeek = today.isoWeekday()

    calendarApi.unselect()

    if (weekNumber < currentWeek || (weekNumber === currentWeek && currentDayOfWeek >= 5 && currentDayOfWeek <= 7)) {
      confirm.require({
        message: 'Eintrag für diese Woche nicht mehr möglich',
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
        message: 'Du hast an diesem Tag bereits einen Eintrag gemacht',
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

      appStore.setAppMessage(200, 'Kalenderdaten wurden gespeichert')
    } else {
      appStore.setAppMessage(400, 'Kalenderdaten könten nicht gespeichert werden')
    }
  }
}
</script>

<template>
  <FullCalendar ref="calendarContainer" :options="calendarOptions">
    <template #eventContent="arg">
      <div class="calendar-entry" v-tooltip.bottom="getTooltipMessage(arg.event.classNames)"><img
          style="margin-right: 7px"
          src="@/assets/salat.svg" alt="salat icon">{{ arg.event.title }}
      </div>
    </template>
  </FullCalendar>
</template>

<style>
.p-dialog-footer {
  justify-content: flex-start !important;
  flex-direction: row-reverse !important;
}

.p-tooltip {
  font-size: 12px;
  min-width: 295px;
  padding: 8px;
}

.fc-daygrid-dot-event:hover {
  cursor: pointer;
}

.fc .fc-daygrid-day.fc-day-today {
  background-color: #d2c288;
}

.fc .fc-daygrid-week-number {
  background-color: transparent;
}

.fc .fc-daygrid-day-number {
  color: #474242;
}

.calendar-entry {
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  padding: 5px 5px 5px 15px;
  font-size: 18px;
}

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