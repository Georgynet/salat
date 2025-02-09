import moment from 'moment'
import http from '@/http.js'
import useUsersStore from '@/stores/usersStore.js'
import {inject} from 'vue'

const usersStore = useUsersStore()

const useUsersService = () => {
    const appConfig = inject('config')

    const fetchUsers = async () => {
        const response = await http.get('/api/users/list')
        usersStore.setUsers(response.data.users)

        return usersStore.getUsers()
    }

    const changeEntryStatus = async (entryId, newStatus) => {
        const response = await http.put('/api/user/calendar/update-calendar-entry-status', {
            calendarEntryId: entryId,
            newStatus: newStatus
        })

        return response.status === 200
    }

    const fetchUserEntries = async (startDate, endDate) => {
        const response = await http.get('/api/user/calendar/all-user-list', {
            params: {
                start_date:  startDate.format(appConfig.DATE_FORMAT),
                end_date: endDate.format(appConfig.DATE_FORMAT)
            }
        })
        const users = usersStore.getUsers()

        const entries = new Map()
        response.data.calendarEntries.forEach(entry => {
            entry.user = users.get(entry.userId)
            delete entry.userId
            entries.set(moment(entry.date).format(appConfig.DATE_FORMAT) + '_' + entry.user.id, entry)
        })

        return entries
    }
    const fetchNumberOfPlates = async (statsDay) => {
        try {
            const response = await http.get('/api/stats/get-number-of-plates', {
                params: {stats_date: statsDay}
            });
            return response.data.numberOfPlates;
        } catch (error) {
            console.error('Can not become a number of plates', error);
            return 0;
        }
    }

    const savePlatesNumber = async (statsDay, numberOfPlates) => {
        try {
            const response = await http.post('/api/stats/save-number-of-plates', {
                statsDay,
                numberOfPlates
            });
            return response.status === 200;
        } catch (error) {
            console.error('Error saving plates number:', error);
            return false;
        }
    }

    return {
        changeEntryStatus,
        fetchUsers,
        fetchUserEntries,
        fetchNumberOfPlates,
        savePlatesNumber
    }
}

export default useUsersService