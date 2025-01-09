import http from '@/http.js'
import { inject } from 'vue'
import moment from 'moment'

const useCalendarService = () => {
    const appConfig = inject('config')

    const getEvents = async (startDate, endDate) => {
        const response = await http.get('/api/user/calendar/current-user-list?start_date=' + startDate.format(appConfig.DATE_FORMAT) + '&end_date=' + endDate.format(appConfig.DATE_FORMAT))
        if (!response.data.calendarEntries) {
            return []
        }

        return response.data.calendarEntries.filter(entry => {
            entry.startDate = moment(entry.date)
            entry.endDate = moment(entry.date).add(1, 'd')
            return entry
        })
    }

    const addEvent = async (startDate, endDate) => {
        return await http.post('/api/user/calendar/add', {
            startDate: startDate.format(appConfig.DATETIME_FORMAT),
            endDate: endDate.format(appConfig.DATETIME_FORMAT)
        })
    }

    return {
        getEvents,
        addEvent
    }
}

export default useCalendarService