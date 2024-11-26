import http from '@/http.js'

const useCalendarService = () => {
    const getEvents = async () => {
        const response = await http.get('/api/user/calendar/current-user-list')
        if (!response.data.users) {
            return []
        }

        return response.data.users
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