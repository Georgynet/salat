import {ref} from 'vue'
import moment from "moment";

const userDefaults = () => {
    return {
        username: null,
        role: 'guest',
        startRoute: 'user.dashboard',
        token: null,
        isExpired: true
    }
}

const user = ref(userDefaults())

const useUserStore = () => {
    const getUser = () => {
        return user.value
    }

    const setUserToken = async (token) => {
        if (token === null) {
            localStorage.removeItem('token')
            user.value = userDefaults()
            return
        }

        const tokenData = JSON.parse(atob(token.split('.')[1]))

        user.value = {
            username: tokenData.username,
            role: tokenData.role,
            startRoute: tokenData.role === 'admin' ? 'admin.users' : 'user.dashboard',
            token,
            isExpired: tokenData.exp - moment().unix() <= 0
        }

        localStorage.setItem('token', token)
    }

    const isAuthenticated = () => {
        return user.value.token !== null
    }

    return {
        isAuthenticated,
        getUser,
        setUserToken
    }
}

export default useUserStore