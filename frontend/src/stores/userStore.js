import {ref} from 'vue'

const userDefaults = () => {
    return {
        username: null,
        role: 'guest',
        startRoute: 'user.dashboard',
        token: null
    }
}

const user = ref(userDefaults())

const useUserStore = () => {
    const getUser = () => {
        return user.value
    }

    const setUserToken = (token) => {
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
            token
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