import http from '@/http.js'
import useUserStore from '@/stores/userStore'

const useUserService = () => {
    const login = async () => {
        const response = await http.post('/api/register/cloudflare')
        if (response.status !== 200) {
            return false
        }

        const { setUserToken } = useUserStore()
        setUserToken(response.data.token)

        return true
    }

    return {
        login,
    }
}

export default useUserService