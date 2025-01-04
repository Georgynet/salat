import http from '@/http.js'
import moment from 'moment'

const useCalendarService = () => {
    const dateFormat = 'YYYY-MM-DD'

    const groupedEntries = (entries) => {
        const groupedEntries = []
        let currentGroup = null
        //--todo Sortierung bereits aus dem BE
        //--todo Filter pro Monat
        entries.sort((a, b) => moment(a.date).diff(moment(b.date))).forEach(entry => {
            const date = moment(entry.date)
            if (currentGroup === null || !date.endOf('day').isSame(moment(currentGroup.endDate).add(1, 'day').endOf('day'))) {
                if (currentGroup !== null) {
                    currentGroup.endDate = moment(currentGroup.endDate).add(1, 'day').format(dateFormat)
                }

                currentGroup = {
                    startDate: date.format(dateFormat),
                    endDate: date.format(dateFormat),
                    status: entry.status
                }

                groupedEntries.push(currentGroup)
            } else {
                currentGroup.endDate = date.format(dateFormat)
            }
        })

        return groupedEntries
    }

    const getEvents = async () => {
        const response = await http.get('/api/user/calendar/current-user-list')
        if (!response.data.calendarEntries) {
            return []
        }

        return groupedEntries(response.data.calendarEntries)
    }

    const addEvent = async (startDate, endDate) => {
        const response = await http.post('/api/user/calendar/add', {
            startDate: startDate + "T00:00:00Z",
            endDate: endDate + "T00:00:00Z"
        })

        return response.status === 200
    }

    return {
        getEvents,
        addEvent
    }
}

export default useCalendarService