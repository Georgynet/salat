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

    const fetchUserEntries = async (startDate, endDate) => {
        const response = await http.get('/api/user/calendar/all-user-list?start_date=' + startDate.format(appConfig.DATE_FORMAT) + '&end_date=' + endDate.format(appConfig.DATE_FORMAT))
        const users = usersStore.getUsers()

        const entries = []
        response.data.calendarEntries.forEach(entry => {
            entry.user = users.get(entry.userId)
            delete entry.userId
            entries.push(entry)
        })

        return entries
    }

    return {
        fetchUsers,
        fetchUserEntries,
    }
}

export default useUsersService