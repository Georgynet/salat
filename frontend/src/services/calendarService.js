import http from '@/http.js'
import moment from 'moment'

const useCalendarService = () => {
    const dateFormat = 'YYYY-MM-DD'

    const getEvents = async () => {
        const response = await http.get('/api/user/calendar/current-user-list')
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
        const response = await http.post('/api/user/calendar/add', {
            startDate: startDate.format(dateFormat) + "T00:00:00Z",
            endDate: endDate.format(dateFormat) + "T00:00:00Z"
        })

        return response.status === 200
    }

    return {
        getEvents,
        addEvent
    }
}

export default useCalendarService