import {ref} from 'vue'

const appMessage = ref(null)
let appMessageTimeout = null

const useAppStore = () => {
    const setAppMessage = (statusCode, message, hideInMs = 4000) => {
        let type = 'error'
        switch (statusCode) {
            case 200:
                type = 'success'
                break;
            case 400:
                type = 'warn'
                break;
            case 404:
                type = 'warn'
                message = message ?? 'Content not found'
                break;
        }

        appMessage.value = { type, message }
        if (hideInMs > 0) {
            window.clearTimeout(appMessageTimeout)
            appMessageTimeout = window.setTimeout(() => {
                appMessage.value = null
            }, hideInMs)
        }
    }

    const isDarkModeEnabled = ref(localStorage.getItem('darkMode') === 'true' ?? false)
    const toggleDarkMode = () => {
        if (isDarkModeEnabled.value) {
            disableDarkMode()
            return
        }

        enableDarkMode()
    }

    const enableDarkMode = () => {
        document.documentElement.classList.add('dark-mode')
        isDarkModeEnabled.value = true
        localStorage.setItem('darkMode', 'true')
    }

    const disableDarkMode = () => {
        document.documentElement.classList.remove('dark-mode')
        isDarkModeEnabled.value = false
        localStorage.setItem('darkMode', 'false')
    }

    return {
        setAppMessage,
        appMessage,
        isDarkModeEnabled,
        enableDarkMode,
        disableDarkMode,
        toggleDarkMode,
    }
}

export default useAppStore