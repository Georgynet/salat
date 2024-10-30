<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  selectable: true,
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridWeek,dayGridMonth'
  },
  eventClick: (info) => {
    info.el.style.borderColor = 'red';
  },
  select: (selectInfo) => {
    const calendarApi = selectInfo.view.calendar
    calendarApi.unselect()
    calendarApi.addEvent({
      title: "Salat",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    })
  },
  events: [
    {
      id: 'a',
      title: 'Mein Salat',
      start: '2024-10-28',
      end: '2024-10-30'
    },
    {
      id: 'b',
      title: 'Mein Salat',
      start: '2024-10-31',
      end: '2024-11-01'
    }
  ]
}

</script>

<template>
  <FullCalendar :options="calendarOptions"></FullCalendar>
</template>