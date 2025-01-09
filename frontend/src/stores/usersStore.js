import {ref} from 'vue'

const userMap = ref([])

const useUsersStore = () => {
    const setUsers = (users) => {
        const map = new Map()
        users.forEach(user => {
            map.set(user.id, user)
        })

        userMap.value = map
    }

    const getUsers = () => {
        return userMap.value
    }

    return {
        getUsers,
        setUsers
    }
}

export default useUsersStore